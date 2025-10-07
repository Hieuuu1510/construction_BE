import httpError from "../../common/helper/httpError.helper.js";
import type { IUser } from "./user.interface.js";
import { UserModel } from "./user.model.js";
import { userValidateChangePass, userValidateLogin } from "./user.schema.js";

export class UserService {
  async register(body: IUser) {
    const { username, email, password } = body;

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      throw new httpError(409, "Email đã tồn tại");
    }

    const user = await UserModel.create({
      username,
      email,
      password,
    });

    if (!user) {
      throw new httpError(500, "Lỗi server");
    }

    return user;
  }

  async login(body: IUser) {
    const validateData = userValidateLogin.parse(body);
    const { email, password } = validateData;

    const userExist = await UserModel.findOne({ email }).select("+password");
    if (!userExist) {
      throw new httpError(400, "User không tồn tại");
    }

    const checkPassword = await userExist.correctPassword(
      password,
      userExist.password
    );
    if (!checkPassword) {
      throw new httpError(400, "Mật khẩu không chính xác");
    }

    return userExist;
  }

  async changePass(body: IUser) {
    const validateBody = userValidateChangePass.parse(body);
    const { password, new_password = "", email } = validateBody;

    const userExist = await UserModel.findOne({ email }).select("+password");

    if (!userExist) {
      throw new httpError(500, "User không tồn tại");
    }

    const isPassword = await userExist.correctPassword(
      password,
      userExist.password
    );

    if (!isPassword) {
      throw new httpError(500, "Mật khẩu không chính xác");
    }

    if (password === new_password) {
      throw new httpError(500, "Mật khẩu mới phải khác mật khẩu hiện tại");
    }

    userExist.password = new_password;
    await userExist.save();
  }
}
