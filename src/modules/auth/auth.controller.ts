import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { UserRefetchTokenService } from "../userRefetchToken/UserRefetchToken.service.js";

const authService = new AuthService();

export class AuthController {
  async me(req: Request, res: Response) {
    const { id } = (req as any).user;

    const user = await authService.getMe(id);
    return res.status(200).json({
      message: "Lấy thông tin user thành công",
      data: user,
    });
  }

  async register(req: Request, res: Response) {
    const user = await authService.register(req.body);

    return res.status(201).json({
      message: "Đăng ký thành công",
      data: user,
    });
  }

  async login(req: Request, res: Response) {
    const user = await authService.login(req.body);

    return res.status(200).json(user);
  }

  async changePass(req: Request, res: Response) {
    const result = await authService.changePass(req.body);

    return res.status(200).json(result);
  }

  async logout(req: Request, res: Response) {
    const { refetchToken } = req.body;
    await authService.logout(refetchToken);

    return res.status(200).json({
      message: "Đăng xuất thành công",
    });
  }

  async refreshToken(req: Request, res: Response) {
    const { refetchToken } = req.body;
    const result = await authService.refreshToken(refetchToken);

    return res.status(200).json(result);
  }
}
