import type { Request, Response } from "express";
import { UserService } from "./user.service.js";

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    const user = await userService.register(req.body);
    return res.status(200).json({
      message: "Đăng ký thành công",
      data: user,
    });
  }
}
