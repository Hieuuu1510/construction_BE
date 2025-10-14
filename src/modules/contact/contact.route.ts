import { Router } from "express";
import contactController from "./contact.controller.js";
import { uploadFile } from "../../middleware/multer.js";

const router = Router();

router.get("/", contactController.getContacts);
router.get("/:id", contactController.getContact);
router.post("/create", contactController.createContact);
router.post("/exports", contactController.exportsContact);
router.post(
  "/imports",
  uploadFile.single("file"),
  contactController.importContacts
);

export default router;
