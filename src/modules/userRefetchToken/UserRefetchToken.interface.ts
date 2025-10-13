import type { baseEntity } from "../../common/interfaces/common.interface.js";

export interface IUserRefetchToken extends baseEntity {
  user_id: string;
  refresh_token: string;
}
