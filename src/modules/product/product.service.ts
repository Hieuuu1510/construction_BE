import { ProductModel } from "./product.model.js";
import { Sort } from "../../common/enums/sort.enum.js";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";
import {
  ProductUpdateValidation,
  ProductValidation,
  type Product,
  type ProductUpdate,
} from "./product.schema.js";
import mongoose from "mongoose";

interface IProducts extends IFilterCommon {
  productCategory?: string;
  product_category_id?: string;
}

export class ProductService {
  async findMany(filter: IProducts) {
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

    if (filter?.product_category_id) {
      queryObj.product_category_id = filter.product_category_id;
    }

    const baseQuery = ProductModel.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort({ [column]: sort === Sort.DESC ? -1 : 1 });

    if (filter?.productCategory === "true") {
      baseQuery.populate("product_category_id");
    }

    const [data, total] = await Promise.all([
      baseQuery,
      ProductModel.countDocuments(),
    ]);

    return {
      data,
      total,
    };
  }

  async findById(id: string | number) {
    if (!id) {
      throw new Error("ID không được bỏ trống");
    }

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      throw new Error("ID phải có kiểu dữ liệu ObjectId");
    }

    return await ProductModel.findById(id).populate("product_category_id");
  }

  async create(data: Product) {
    await ProductValidation.parseAsync(data);

    const resultCreate = await ProductModel.create(data);

    if (!resultCreate) {
      throw new Error("Tạo sản phẩm thất bại");
    }

    return resultCreate;
  }

  async remove(id: string) {
    const resultDetail = await this.findById(id);
    if (!resultDetail) {
      throw new Error("Sản phẩm không tồn tại");
    }

    const resultDelete = await ProductModel.findByIdAndDelete(id);

    if (!resultDelete) {
      throw new Error("Xoa san pham that bai");
    }

    return resultDelete;
  }

  async update(id: string, data: ProductUpdate) {
    const resultDetail = await this.findById(id);

    if (!resultDetail) {
      throw new Error("Sản phẩm không tồn tại");
    }

    await ProductUpdateValidation.parseAsync(data);

    const resultUpdate = await ProductModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!resultUpdate) {
      throw new Error("Cập nhật sản phẩm thất bại");
    }

    return resultUpdate;
  }
}
