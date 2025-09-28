import type mongoose from "mongoose";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";

export interface IConstructionFilter extends IFilterCommon {
  construction_category_id?: string;
  exclude_id?: {
    $ne: mongoose.Types.ObjectId;
  };
  view_count?: string;
  constructionCategory?: string;
}
