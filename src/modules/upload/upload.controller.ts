import type { Request, Response } from "express";
import { UploadService } from "./upload.service.js";

const uploadService = new UploadService();

export class UploadController {
  async uploadSingle(req: Request, res: Response) {
    console.log("controllerUpload", req.file);
    try {
      if (!req.file)
        return res.status(400).json({
          err_message: "No file uploaded",
        });

      const result = await uploadService.uploadSingle(req.file);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        err_message: (error as Error).message,
      });
    }
  }

  async uploadMultiple(req: Request, res: Response) {
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
