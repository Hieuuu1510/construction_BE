import { NewsModel } from "./news.model.js";
import { Sort } from "../../common/enums/sort.enum.js";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";
import {
  NewsUpdateValidation,
  NewsValidation,
  type News,
  type NewsUpdate,
} from "./news.schema.js";
import { th } from "zod/locales";
import httpError from "../../common/helper/httpError.helper.js";
import mongoose from "mongoose";

interface INews extends IFilterCommon {
  newsCategory?: string;
  news_category_id?: string;
}

export class NewsService {
  async findMany(filter: INews) {
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

    if (filter?.news_category_id) {
      queryObj.news_category_id = filter.news_category_id;
    }

    const baseQuery = NewsModel.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort({ [column]: sort === Sort.DESC ? -1 : 1 });

    if (filter?.newsCategory === "true") {
      baseQuery.populate("news_category_id");
    }

    const [data, total] = await Promise.all([
      baseQuery,
      NewsModel.countDocuments(),
    ]);

    return {
      data,
      total,
    };
  }

  async findById(id: string | number) {
    if (!id) throw new httpError(400, "ID không được để trống");

    if (!mongoose.Types.ObjectId.isValid(id as string))
      throw new httpError(400, "ID phải có kiểu dữ liệu ObjectId");

    return await NewsModel.findById(id).populate("news_category_id");
  }

  async create(data: News) {
    await NewsValidation.parseAsync(data);
    return NewsModel.create(data);
  }

  async remove(id: string) {
    const newsDetail = await this.findById(id);

    if (!newsDetail) {
      throw new httpError(400, "Tin tức không tồn tại");
    }

    const resultDelete = await NewsModel.findByIdAndDelete(id);

    if (!resultDelete) {
      throw new httpError(500, "Xoá tin tức thất bại");
    }

    return resultDelete;
  }

  async update(id: string, data: NewsUpdate) {
    const newsDetail = await this.findById(id);

    if (!newsDetail) {
      throw new httpError(400, "Tin tức không tồn tại");
    }

    await NewsUpdateValidation.parseAsync(data);
    const resultUpdate = await NewsModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!resultUpdate) {
      throw new httpError(500, "Cập nhật tin tức thất bại");
    }

    return resultUpdate;
  }
}
