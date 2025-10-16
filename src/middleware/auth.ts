import type { NextFunction, Request, Response } from "express";
import httpError from "../common/helper/httpError.helper.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../modules/users/user.model.js";
import { publicRouters } from "../common/constants/publicRoutes.js";

export const middlewareTokenAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { path, method } = req;

    // check api public
    const isPublicPath = publicRouters.some(
      (item) => item.method === method && item.path.test(path)
    );
    if (isPublicPath) {
      return next();
    }

    let decode: any;
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }

    try {
      decode = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      if ((error as any)?.name === "TokenExpiredError") {
        decode = jwt.decode(token);
      }
    }

    if (!decode) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    console.log(decode);

    (req as any).user = await UserModel.findById((decode as any).id);
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Xác thực thất bại",
    });
  }
};

// export const refetchTokenMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {

// }
