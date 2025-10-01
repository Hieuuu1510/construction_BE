import { Router } from "express";
import { UploadController } from "./upload.controller.js";
import { uploadImageVideo } from "../../middleware/multer.js";

const router = Router();

const uploadController = new UploadController();

router.post(
  "/",
  uploadImageVideo.single("file"),
  uploadController.uploadSingle
);
router.post(
  "/multiple",
  uploadImageVideo.array("files", 5),
  uploadController.uploadMultiple
);

export default router;
