import type mongoose from "mongoose";
import type { Role } from "../../common/enums/role.enum.js";
import type { UserStatus } from "../../common/enums/status.enum.js";
import type { baseEntity } from "../../common/interfaces/common.interface.js";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";

export interface IUser extends baseEntity {
  username: string;
  email: string;
  password: string;
  role: Role.USER;
  status: UserStatus;
  new_password?: string;
  phone: string | number;
  created_uid?: string;
  update_uid?: string;
}

export interface IUserMethods {
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
}

export interface IFilterUser extends IFilterCommon {
  is_user?: string;
}
