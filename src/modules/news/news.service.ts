import { NewsModel } from "./news.model.js";
import { Sort } from "../../common/enums/sort.enum.js";
import {
  NewsUpdateValidation,
  NewsValidation,
  type News,
  type NewsUpdate,
} from "./news.schema.js";
import httpError from "../../common/helper/httpError.helper.js";
import mongoose from "mongoose";
import type { INews } from "./news.filter.js";

class NewsService {
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

    if (filter?.news_category_ids) {
      queryObj.news_category_ids = filter.news_category_ids;
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

    const baseQuery = NewsModel.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort({ [column]: sort === Sort.DESC ? -1 : 1 });

    if (filter?.newsCategory === "true") {
      baseQuery.populate("news_category_ids");
    }

    const [data, total] = await Promise.all([
      baseQuery,
      NewsModel.countDocuments(queryObj),
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

    // mỗi lần gọi detail thì tăng thêm 1 view
    await NewsModel.findByIdAndUpdate(id, {
      $inc: { view_count: 1 },
    });

    const newsDetail = await NewsModel.findById(id).populate(
      "news_category_ids"
    );

    if (!newsDetail) {
      throw new httpError(400, "Tin tức không tồn tại");
    }

    return newsDetail;
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

export default new NewsService();
