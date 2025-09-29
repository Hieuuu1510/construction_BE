import type mongoose from "mongoose";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";

export interface INews extends IFilterCommon {
  newsCategory?: string;
  news_category_ids?: string[];
  view_count?: string;
  exclude_id?: mongoose.Types.ObjectId | string;
}
