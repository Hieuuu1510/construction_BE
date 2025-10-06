import type { Role } from "../../common/enums/role.enum.js";
import type { UserStatus } from "../../common/enums/status.enum.js";

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: Role.USER;
  status: UserStatus;
}

export interface IUserMethods {
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
}
