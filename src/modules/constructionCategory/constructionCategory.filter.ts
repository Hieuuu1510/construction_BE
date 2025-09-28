import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";

export interface IConstructionCategoryFilter extends IFilterCommon {
  construction_count?: string;
  ids?: string[];
}
