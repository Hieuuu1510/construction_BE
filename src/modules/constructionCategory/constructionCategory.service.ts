import mongoose from "mongoose";
import { Sort } from "../../common/enums/sort.enum.js";
import httpError from "../../common/helper/httpError.helper.js";
import { NewsModel } from "../news/news.model.js";
import {
  ConstructionCategoriesUpdateValidation,
  ConstructionCategoriesValidation,
  type IConstructionCategory,
  type IConstructionCategoryUpdate,
} from "./constructionCategory.schema.js";
import { ConstructionCategoryModel } from "./constructionCategory.model.js";
import type { IConstructionCategoryFilter } from "./constructionCategory.filter.js";

class ConstructionCategoryService {
  async findMany(filter: IConstructionCategoryFilter) {
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

    if (filter?.ids) {
      queryObj._id = {
        $in: filter.ids?.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    console.log(filter, queryObj);

    const pipeline: mongoose.PipelineStage[] = [
      {
        $match: queryObj,
      },
      {
        $sort: {
          [column]: sort === Sort.DESC ? -1 : 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    if (filter?.construction_count === "true") {
      pipeline.push({
        $lookup: {
          from: "constructions",
          localField: "_id",
          foreignField: "construction_category_id",
          as: "constructions",
        },
        $addFields: {
          count_construction: {
            $size: "$constructions",
          },
        },
        $project: {
          constructions: 0,
        },
      });
    }

    const [data, total] = await Promise.all([
      ConstructionCategoryModel.aggregate(pipeline),
      ConstructionCategoryModel.countDocuments(),
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

    const categoryDetail = await ConstructionCategoryModel.findById(id);

    if (!categoryDetail) {
      throw new httpError(400, "Danh mục không tồn tại");
    }

    return categoryDetail;
  }

  async create(data: IConstructionCategory) {
    await ConstructionCategoriesValidation.parseAsync(data);
    const resultCreate = await ConstructionCategoryModel.create(data);

    if (!resultCreate) {
      throw new httpError(500, "Tạo danh mục thất bại");
    }

    return resultCreate;
  }

  async remove(id: string) {
    const categoryDetail = await this.findById(id);

    // check danh mục có tồn tại không
    if (!categoryDetail) {
      throw new httpError(400, "Danh mục không tồn tại");
    }

    // check danh mục đã được gán cho construction chưa
    const resultCategory = await NewsModel.countDocuments({
      news_category_id: id,
    });

    if (resultCategory > 0) {
      throw new httpError(400, "Không được xoá danh mục đã gán cho thi công");
    }

    const resultDelete = await ConstructionCategoryModel.findByIdAndDelete(id);

    if (!resultDelete) {
      throw new httpError(500, "Xoá danh mục thất bại");
    }

    return resultDelete;
  }

  async update(id: string, data: IConstructionCategoryUpdate) {
    const categoryDetail = await this.findById(id);

    if (!categoryDetail) {
      throw new httpError(500, "Danh mục tin tức không tồn tại");
    }

    await ConstructionCategoriesUpdateValidation.parseAsync(data);

    const resultUpdate = await ConstructionCategoryModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );

    if (!resultUpdate) {
      throw new httpError(500, "Cập nhật danh mục thất bại");
    }

    return resultUpdate;
  }
}

export default new ConstructionCategoryService();
