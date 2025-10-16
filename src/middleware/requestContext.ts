import { AsyncLocalStorage } from "async_hooks";
import type { NextFunction, Request, Response } from "express";

// AsyncLocalStorage tạo 1 context dữ liệu có thể được truy cập trong suốt vòng đời của một thao tác bất đồng bộ

export const als = new AsyncLocalStorage<{ userId?: string }>();

export function requestContext(
  req: Request,
  res: Response,
  next: NextFunction
) {
  als.run({ userId: (req as any).user?._id.toString() }, () => {
    next();
  });
}
