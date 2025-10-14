import mongoose from "mongoose";
import { Sort } from "../../common/enums/sort.enum.js";
import httpError from "../../common/helper/httpError.helper.js";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";
import { ProductCategoryModel } from "./productCategory.model.js";
import {
  ProductCategoriesUpdateValidation,
  ProductCategoriesValidation,
  type ProductCategories,
  type ProductCategoriesUpdate,
} from "./productCategory.schema.js";
import { ProductModel } from "../product/product.model.js";

class ProductCategoryService {
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
      ProductCategoryModel.find(queryObj)
        .limit(limit)
        .skip(skip)
        .sort({ [column]: sort === Sort.DESC ? -1 : 1 }),
      ProductCategoryModel.countDocuments(),
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

    return await ProductCategoryModel.findById(id);
  }

  async create(data: ProductCategories) {
    await ProductCategoriesValidation.parseAsync(data);
    const resultCreate = await ProductCategoryModel.create(data);

    if (!resultCreate) {
      throw new httpError(500, "Tạo danh mục sản phẩm thất bại");
    }

    return resultCreate;
  }

  async remove(id: string) {
    const resultDetail = await this.findById(id);
    if (!resultDetail) {
      throw new httpError(400, "Danh mục sản phẩm không tồn tại");
    }

    return ProductCategoryModel.findByIdAndDelete(id);
  }

  async update(id: string, data: ProductCategoriesUpdate) {
    const resultDetail = await this.findById(id);
    if (!resultDetail) {
      throw new httpError(400, "Danh mục sản phẩm không tồn tại");
    }

    await ProductCategoriesUpdateValidation.parseAsync(data);

    const resultProductCategory = await ProductModel.countDocuments({
      product_category_id: id,
    });
    if (resultProductCategory > 0)
      throw new httpError(
        500,
        "Không được xoá danh mục đã được gán cho sản phẩm "
      );

    const resultUpdate = await ProductCategoryModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    if (!resultUpdate) {
      throw new httpError(500, "Cập nhật danh mục thất bại");
    }

    return resultUpdate;
  }
}

export default new ProductCategoryService();
