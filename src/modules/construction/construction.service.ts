import { ConstructionModel } from "./construction.model.js";
import { Sort } from "../../common/enums/sort.enum.js";
import httpError from "../../common/helper/httpError.helper.js";
import mongoose from "mongoose";
import type { IConstructionFilter } from "./construction.filter.js";
import {
  constructionUpdateValidation,
  constructionValidation,
  type IConstruction,
  type IConstructionUpdate,
} from "./construction.schema.js";

class ConstructionService {
  async findMany(filter: IConstructionFilter) {
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
        { title: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
      ];
    }

    if (filter?.construction_category_ids) {
      queryObj.construction_category_ids = filter.construction_category_ids;
    }

    if (filter?.view_count) {
      queryObj.view_count = {
        $gt: 0, // $gt: lớn hơn 0
      };
    }

    if (filter?.exclude_id) {
      queryObj._id = {
        $ne: filter.exclude_id,
      };
    }

    const expires = Date.now() + 1000 * 5; // 5 phút

    console.log(expires - Date.now());

    if (filter?.status) {
      queryObj.status = { $in: filter.status };
    }

    const baseQuery = ConstructionModel.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort({ [column]: sort === Sort.DESC ? -1 : 1 });

    if (filter?.constructionCategory === "true") {
      baseQuery.populate("construction_category_ids");
    }

    const [data, total] = await Promise.all([
      baseQuery,
      ConstructionModel.countDocuments(queryObj),
    ]);

    return {
      data,
      total,
    };
  }

  async findById(id: string) {
    if (!id) throw new httpError(400, "ID không được để trống");

    if (!mongoose.Types.ObjectId.isValid(id as string))
      throw new httpError(400, "ID phải có kiểu dữ liệu ObjectId");

    await ConstructionModel.findByIdAndUpdate(id, {
      $inc: { view_count: 1 }, // $inc tăng giảm giá trị của feild
    });

    const constructionDetail = await ConstructionModel.findById(id).populate(
      "construction_category_ids"
    );

    if (!constructionDetail) {
      throw new httpError(400, "Tin tức không tồn tại");
    }

    return constructionDetail;
  }

  async create(data: IConstruction) {
    await constructionValidation.parseAsync(data);
    return ConstructionModel.create(data);
  }

  async remove(id: string) {
    const newsDetail = await this.findById(id);

    if (!newsDetail) {
      throw new httpError(400, "Tin tức không tồn tại");
    }

    const resultDelete = await ConstructionModel.findByIdAndDelete(id);

    if (!resultDelete) {
      throw new httpError(500, "Xoá tin tức thất bại");
    }

    return resultDelete;
  }

  async update(id: string, data: IConstructionUpdate) {
    const newsDetail = await this.findById(id);

    if (!newsDetail) {
      throw new httpError(400, "Tin tức không tồn tại");
    }

    await constructionUpdateValidation.parseAsync(data);
    const resultUpdate = await ConstructionModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!resultUpdate) {
      throw new httpError(500, "Cập nhật tin tức thất bại");
    }

    return resultUpdate;
  }
}

export default new ConstructionService();
