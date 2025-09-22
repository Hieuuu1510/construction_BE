import { Router } from "express";
import { GalleryController } from "./gallery.controller.js";

const router = Router();
const galleryController = new GalleryController();

router.post("/create", galleryController.createGallery);
router.get("/", galleryController.getGalleries);
router.get("/:id", galleryController.getGallery);
router.delete("/:id", galleryController.deleteGallery);
router.put("/:id", galleryController.updateGallery);

export default router;
