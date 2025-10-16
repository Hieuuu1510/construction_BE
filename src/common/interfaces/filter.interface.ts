import type { Status } from "../enums/status.enum.js";

export interface IFilterCommon {
  page?: number;
  limit?: number;
  query?: string;
  sort?: string;
  column?: string;
  from?: string;
  to?: string;
  status?: Status[];
}
