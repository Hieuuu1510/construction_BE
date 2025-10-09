import type { NextFunction, Request, Response } from "express";
import httpError from "../common/helper/httpError.helper.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../modules/users/user.model.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new httpError(401, "Bạn không có quyền truy cập");
    }
    // decode xem có phải là object không
    const decode = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decode) {
      throw new httpError(401, "Bạn không có quyền truy cập");
    }

    (req as any).user = await UserModel.findById((decode as any).id);
    next();
  } catch (error) {
    if ((error as any)?.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token hết hạn",
      });
    }

    return res.status(401).json({
      message: "Token không hợp lệ",
    });
  }
};
