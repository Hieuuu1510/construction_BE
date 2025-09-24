import { typeUpload } from "../enums/upload.enum.js";
import path from "path";
import type { NextFunction, Response } from "express";

// check file type trước khi upload
export function checkFileType(
  file: Express.Multer.File,
  res: Response,
  next: NextFunction
) {
  const isVideo = file?.mimetype.startsWith(typeUpload.VIDEO);

  const regexFiletypes = isVideo
    ? /mp4|avi|mov|mkv|wmv|flv|webm/
    : /jpeg|jpg|png|gif/;

  // lấy định dạng file
  const extname = regexFiletypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = regexFiletypes.test(file.mimetype);

  if (mimetype && extname) {
    return next();
  } else {
    return isVideo
      ? res.status(400).json({
          err_message:
            "Error: Video only! (mp4, avi, mov, mkv, wmv, flv, webm)",
        })
      : res.status(400).json({
          err_message: "Error: Images only! (jpeg, jpg, png, gif)",
        });
  }
}
