import type { NextFunction, Request, Response } from "express";

export function queryBooleanParser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  for (const key in req.query) {
    const value = req.query[key];
    if (value === "true") {
      req.query[key] = true as any;
    } else if (value === "false") {
      req.query[key] = false as any;
    }
  }
  next();
}
