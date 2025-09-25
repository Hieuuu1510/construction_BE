import mongoose from "mongoose";
import { Sort } from "../../common/enums/sort.enum.js";
import httpError from "../../common/helper/httpError.helper.js";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";
import { NewsCategoryModel } from "./newsCategory.model.js";
import {
  NewsCategoriesUpdateValidation,
  NewsCategoriesValidation,
  type NewsCategories,
  type NewsCategoriesUpdate,
} from "./newsCategory.schema.js";
import { NewsModel } from "../news/news.model.js";

export class NewsCategoryService {
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
        { slug: { $regex: query, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      NewsCategoryModel.find(queryObj)
        .limit(limit)
        .skip(skip)
        .sort({ [column]: sort === Sort.DESC ? -1 : 1 }),
      NewsCategoryModel.countDocuments(),
    ]);

    return {
      data,
      total,
    };
  }

  async findById(id: string | number) {
    if (!id) {
      throw new httpError(400, "ID không được để trống");
    }

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      throw new httpError(400, "ID phải có kiểu dữ liệu ObjectId");
    }

    const newsCategoryDetail = await NewsCategoryModel.findById(id);

    if (!newsCategoryDetail) {
      throw new httpError(400, "Tin tức không tồn tại");
    }

    return newsCategoryDetail;
  }

  async create(data: NewsCategories) {
    await NewsCategoriesValidation.parseAsync(data);
    const resultCreate = await NewsCategoryModel.create(data);

    if (!resultCreate) {
      throw new httpError(500, "Tạo tin tức thất bại");
    }

    return resultCreate;
  }

  async remove(id: string) {
    const newsCategoryDetail = await this.findById(id);

    // check news có tồn tại không
    if (!newsCategoryDetail) {
      throw new httpError(400, "Tin tức không tồn tại");
    }

    // check danh mục đã được gán cho tin tức chưa
    const resultNewsCategory = await NewsModel.countDocuments({
      news_category_id: id,
    });

    if (resultNewsCategory > 0) {
      throw new httpError(400, "Không được xoá danh mục đã gán cho tin tức");
    }

    const resultDelete = await NewsCategoryModel.findByIdAndDelete(id);

    if (!resultDelete) {
      throw new httpError(500, "Xoá tin tức thất bại");
    }

    return resultDelete;
  }

  async update(id: string, data: NewsCategoriesUpdate) {
    const newsCategoryDetail = await this.findById(id);

    if (!newsCategoryDetail) {
      throw new httpError(500, "Danh mục tin tức không tồn tại");
    }

    await NewsCategoriesUpdateValidation.parseAsync(data);

    const resultUpdate = await NewsCategoryModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!resultUpdate) {
      throw new httpError(500, "Cập nhật tin tức thất bại");
    }

    return resultUpdate;
  }
}
