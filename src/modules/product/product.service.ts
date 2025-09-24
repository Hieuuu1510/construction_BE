import { ProductModel } from "./product.model.js";
import { Sort } from "../../common/enums/sort.enum.js";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";
import type { Product, ProductUpdate } from "./product.schema.js";

interface IProducts extends IFilterCommon {
  productCategory?: string;
  product_category_id?: string;
}

export class ProductService {
  async findMany(filter: IProducts) {
    const {
      page = 1,
      limit = 10,
      query = "",
      sort = Sort.DESC,
      column = "createdAt",
    } = filter;

    const skip = (page - 1) * limit;

    const queryObj: any = {};

    if (query !== "") {
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

    console.log(queryObj);

    const [data, total] = await Promise.all([
      baseQuery,
      ProductModel.countDocuments(queryObj),
    ]);

    return {
      data,
      total,
    };
  }

  async findById(id: string | number) {
    return await ProductModel.findById(id).populate("product_category_id");
  }

  async create(data: Product) {
    return ProductModel.create(data);
  }

  async remove(id: string) {
    return ProductModel.findByIdAndDelete(id);
  }

  async update(id: string, data: ProductUpdate) {
    return ProductModel.findByIdAndUpdate(id, data, { new: true });
  }
}
