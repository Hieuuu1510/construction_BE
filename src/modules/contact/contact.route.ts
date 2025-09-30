import { Router } from "express";
import { ContactController } from "./contact.controller.js";

const router = Router();
const contactController = new ContactController();

router.get("/", contactController.getContacts);
router.get("/:id", contactController.getContact);
router.post("/create", contactController.createContact);

export default router;
