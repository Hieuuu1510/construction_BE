import { Router } from "express";
import uploadController from "./upload.controller.js";
import { uploadImageVideo } from "../../middleware/multer.js";

const router = Router();

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
