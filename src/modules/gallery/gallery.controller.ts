import type { Request, Response } from "express";
import { GalleryService } from "./gallery.service.js";

const galleryService = new GalleryService();

export class GalleryController {
  async getGalleries(req: Request, res: Response) {
    try {
      const galleries = await galleryService.findMany();
      res.status(200).json(galleries);
    } catch (err) {
      res.status(400).json({
        error: (err as Error).message
      })
    }
    
  }
}