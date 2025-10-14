import type { NextFunction, Request, Response } from "express";
import uploadService from "./upload.service.js";
import { typeUpload } from "../../common/enums/upload.enum.js";

class UploadController {
  async uploadSingle(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file)
        return res.status(400).json({
          err_message: "No file uploaded",
        });

      console.log("controllerUpload", req.file);
      const resource_type = req.file.mimetype.startsWith(typeUpload.VIDEO)
        ? typeUpload.VIDEO
        : typeUpload.IMAGE;

      const result = await uploadService.uploadSingle(req.file, resource_type);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        err_message: (error as Error).message,
      });
    }
  }

  async uploadMultiple(req: Request, res: Response) {
    console.log("controllerUploadMultiple", req.files);
    try {
      if (!req.files || !(req.files instanceof Array))
        return res.status(400).json({
          err_message: "No files uploaded",
        });

      const results = await uploadService.uploadMultiple(req.files);

      return res.status(200).json(results);
    } catch (error) {
      return res.status(400).json({
        err_message: (error as Error).message,
      });
    }
  }
}

export default new UploadController();
