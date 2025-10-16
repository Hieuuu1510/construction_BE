import mongoose from "mongoose";
import { Sort } from "../../common/enums/sort.enum.js";
import httpError from "../../common/helper/httpError.helper.js";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";
import { ContactModel } from "./contact.model.js";
import { ContactValidation, type Contact } from "./contact.schema.js";
import XLSX from "xlsx";
import { exportToExcel } from "../../common/helper/exportToExcel.helper.js";
import fs from "fs";
import { exportToPdf } from "../../common/helper/exportToPdf.helper.js";
import { buildDateFilter } from "../../common/helper/buildDateFilter.helper.js";

class ContactService {
  async findMany(filter: IFilterCommon) {
    const {
      page = 1,
      limit = 10,
      query,
      sort = Sort.DESC,
      column = "createdAt",
      from,
      to,
    } = filter;

    const skip = (page - 1) * limit;

    const queryObj: any = {};

    if (query) {
      queryObj.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ];
    }

    const dateFilter = buildDateFilter({
      from: from as string,
      to: to as string,
    });

    if (Object.keys(dateFilter).length > 0) {
      queryObj.createdAt = dateFilter;
    }

    const baseQuery = ContactModel.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort({ [column]: sort === Sort.DESC ? -1 : 1 });

    const [data, total] = await Promise.all([
      baseQuery,
      ContactModel.countDocuments(queryObj),
    ]);

    return {
      data,
      total,
    };
  }

  async findOne(id: string) {
    if (!id) {
      throw new httpError(400, "ID không được bỏ trống");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new httpError(400, "ID phải có kiểu dữ liệu ObjectId");
    }

    const detail = await ContactModel.findById(id);

    if (!detail) {
      throw new httpError(500, "Liên hệ không tồn tại");
    }

    return detail;
  }

  async create(data: Contact) {
    await ContactValidation.parseAsync(data);
    const create = await ContactModel.create(data);

    if (!create) {
      throw new httpError(500, "Tạo liên hệ thất bại");
    }

    return create;
  }

  exportsExcel(data: Contact[]) {
    return exportToExcel({
      data,
      sheetName: "Contact",
    });
  }

  async imports(file: Express.Multer.File | undefined) {
    if (!file) {
      throw new httpError(400, "File không hợp lệ");
    }

    // đọc file excel
    const wb = XLSX.readFile(file.path);

    if (!wb.SheetNames || wb.SheetNames.length === 0) {
      throw new httpError(400, "File không chứa sheet nào");
    }

    const sheetName = wb.SheetNames[0];
    const workSheet = wb.Sheets[sheetName as string];

    fs.unlinkSync(file.path);

    if (!workSheet) {
      throw new httpError(400, `Không đọc được dữ liệu từ file ${sheetName}`);
    }

    const data = XLSX.utils.sheet_to_json(workSheet as XLSX.WorkSheet);

    if (!data.length) {
      throw new httpError(400, "Sheet không có dữ liệu");
    }

    const resultInsertMany = await ContactModel.insertMany(data);

    if (!resultInsertMany) {
      throw new httpError(500, "Tạo liên hệ thất bại");
    }

    return resultInsertMany;
  }

  exportsCSV(data: Contact[]) {
    // json -> sheet
    const workSheet = XLSX.utils.json_to_sheet(data);

    // sheet -> csv
    const csv = XLSX.utils.sheet_to_csv(workSheet);

    return csv;
  }

  async exportsPDF(data: Contact[]) {
    const pdfBuffer = await exportToPdf(data, "exportPDF.ejs");

    if (!pdfBuffer) {
      throw new httpError(500, "Xuất pdf thất bại");
    }

    return pdfBuffer;
  }
}

export default new ContactService();
