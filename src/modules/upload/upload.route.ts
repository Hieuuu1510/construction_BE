import { Router } from "express";
import { UploadController } from "./upload.controller.js";
import { upload } from "../../middleware/multer.js";

const router = Router();

const uploadController = new UploadController();

router.post("/", upload.single("file"), uploadController.uploadSingle);
router.post(
  "/multiple",
  upload.array("files", 5),
  uploadController.uploadMultiple
);

export default router;
