import mongoose from "mongoose";
import { Sort } from "../../common/enums/sort.enum.js";
import httpError from "../../common/helper/httpError.helper.js";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";
import { ContactModel } from "./contact.model.js";
import { ContactValidation, type Contact } from "./contact.schema.js";

export class ContactService {
  async findMany(filter: IFilterCommon) {
    const {
      page = 1,
      limit = 10,
      query,
      sort = Sort.DESC,
      column = "createdAt",
    } = filter;

    const skip = (page - 1) * limit;

    const queryObj: any = {};

    if (query) {
      queryObj.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ];
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
}
