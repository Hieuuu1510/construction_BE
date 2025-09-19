import { Router } from "express";
import { GalleryController } from "./gallery.controller.js";

const router = Router();
const galleryController = new GalleryController();

router.get('/', galleryController.getGalleries);

export default router;