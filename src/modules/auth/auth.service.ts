import httpError from "../../common/helper/httpError.helper.js";
import type { IUser } from "../users/user.interface.js";
import { UserModel } from "../users/user.model.js";
import {
  userValidateChangePass,
  userValidateLogin,
} from "../users/user.schema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userRefetchTokenService from "../userRefetchToken/UserRefetchToken.service.js";
import { UserRefetchTokenModel } from "../userRefetchToken/UserToken.Model.js";

class AuthService {
  constructor() {}
  async register(body: IUser) {
    const { username, email, password, phone } = body;

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      throw new httpError(409, "Email đã tồn tại");
    }
    const hashPassword = await this.hashPassword(password);

    const user = await UserModel.create({
      username,
      email,
      password: hashPassword,
      phone,
    });

    if (!user) {
      throw new httpError(500, "Lỗi server");
    }

    return user;
  }

  async login(body: IUser) {
    const validateData = userValidateLogin.parse(body);
    const { email, password } = validateData;

    const userExist = await UserModel.findOne({ email }).select("+password");
    if (!userExist) {
      throw new httpError(400, "User không tồn tại");
    }

    const token = this.generateToken(userExist);
    const refetchToken = await userRefetchTokenService.createUserRefetchToken(
      userExist._id as string
    );

    const checkPassword = await this.verifyPassword(
      password,
      userExist.password
    );

    if (!checkPassword) {
      throw new httpError(400, "Mật khẩu không chính xác");
    }
    userExist.password = undefined as any;
    return {
      message: "Đăng nhập thành công",
      token,
      refetchToken: refetchToken.refresh_token,
      data: userExist,
    };
  }

  async logout(refetchToken: string) {
    await userRefetchTokenService.revokeUserRefetchToken(refetchToken);
  }

  async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async verifyPassword(
    password: string,
    userPassword: string
  ): Promise<boolean> {
    const isPassword = await bcrypt.compare(password, userPassword);
    return isPassword;
  }

  async getMe(id: number | string) {
    if (!id) {
      throw new httpError(400, "ID không được để trống");
    }

    const userExist = await UserModel.findById(id);
    if (!userExist) {
      throw new httpError(400, "User không tồn tại");
    }

    const { password: _, ...userWithoutPassword } = userExist;
    return userWithoutPassword;
  }

  // tạo token
  generateToken(user: IUser) {
    const payload = {
      id: user._id,
      role: user.role,
      email: user.email,
    };
    const options: jwt.SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || "1h") as any,
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as jwt.Secret,
      options
    );
    return token;
  }

  async changePass(body: IUser) {
    const validateBody = userValidateChangePass.parse(body);
    const { password, new_password = "", email } = validateBody;

    const userExist = await UserModel.findOne({ email }).select("+password");

    if (!userExist) {
      throw new httpError(500, "User không tồn tại");
    }

    const isPassword = await this.verifyPassword(password, userExist.password);

    if (!isPassword) {
      throw new httpError(500, "Mật khẩu không chính xác");
    }

    if (password === new_password) {
      throw new httpError(500, "Mật khẩu mới phải khác mật khẩu hiện tại");
    }

    const hashNewPassword = await this.hashPassword(new_password);
    userExist.password = hashNewPassword;
    await userExist.save();
    // lấy chi tiết user sau khi đổi mật khẩu
    // tạo token mới
  }

  async refreshToken(refetchToken: string) {
    if (!refetchToken) {
      throw new httpError(400, "Refresh token không được để trống");
    }
    const now = new Date();
    const userRefetchToken = await UserRefetchTokenModel.findOne({
      refresh_token: refetchToken,
    }).populate("user_id");

    console.log(userRefetchToken);

    if (!userRefetchToken) {
      throw new httpError(401, "Refresh token không hợp lệ");
    }

    if (userRefetchToken?.expires_at < now) {
      await userRefetchTokenService.revokeUserRefetchToken(refetchToken);
      throw new httpError(401, "Refresh token hết hạn");
    }

    const token = this.generateToken(userRefetchToken?.user_id as IUser);
    return {
      message: "Refresh token thành công",
      token,
    };
  }
}

export default new AuthService();
