import type { Role } from "../../common/enums/role.enum.js";
import type { UserStatus } from "../../common/enums/status.enum.js";
import type { baseEntity } from "../../common/interfaces/common.interface.js";

export interface IUser extends baseEntity {
  username: string;
  email: string;
  password: string;
  role: Role.USER;
  status: UserStatus;
  new_password?: string;
}

export interface IUserMethods {
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
}
