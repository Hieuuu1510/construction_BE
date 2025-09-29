import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";

export interface IProducts extends IFilterCommon {
  productCategory?: string;
  product_category_ids?: string;
}
