import { Router } from "express";
import { UploadController } from "./upload.controller.js";
import upload from "../../middleware/mullter.js";

const router = Router();

const uploadController = new UploadController();

router.post("/", upload.single("image"), uploadController.uploadSingle);
router.post(
  "/multiple",
  upload.array("images", 5),
  uploadController.uploadMultiple
);

export default router;
