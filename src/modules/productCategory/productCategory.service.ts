import { Sort } from "../../common/enums/sort.enum.js";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";
import { ProductCategoryModel } from "./productCategory.model.js";
import type {
  ProductCategories,
  ProductCategoriesUpdate,
} from "./productCategory.schema.js";

export class ProductCategoryService {
  async findMany(filter: IFilterCommon) {
    const {
      page = 1,
      limit = 10,
      query = "",
      sort = Sort.DESC,
      column = "createdAt",
    } = filter;

    const skip = (page - 1) * limit;

    const queryObj = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
      ],
    };

    const [data, total] = await Promise.all([
      ProductCategoryModel.find(queryObj)
        .limit(limit)
        .skip(skip)
        .sort({ [column]: sort === Sort.DESC ? -1 : 1 }),
      ProductCategoryModel.countDocuments(queryObj),
    ]);

    return {
      data,
      total,
    };
  }

  async findById(id: string | number) {
    return await ProductCategoryModel.findById(id);
  }

  async create(data: ProductCategories) {
    return ProductCategoryModel.create(data);
  }

  async remove(id: string) {
    return ProductCategoryModel.findByIdAndDelete(id);
  }

  async update(id: string, data: ProductCategoriesUpdate) {
    return ProductCategoryModel.findByIdAndUpdate(id, data, { new: true });
  }
}
