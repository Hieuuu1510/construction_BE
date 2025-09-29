import type mongoose from "mongoose";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";

export interface IConstructionFilter extends IFilterCommon {
  construction_category_ids?: string;
  exclude_id?: mongoose.Types.ObjectId | string;
  view_count?: string;
  constructionCategory?: string;
}
