import type { Request, Response } from "express";
import galleryService from "./gallery.service.js";

export class GalleryController {
  async getGalleries(req: Request, res: Response) {
    try {
      const galleries = await galleryService.findMany(req.query);
      return res.status(200).json(galleries);
    } catch (err) {
      return res.status(500).json({
        error: (err as Error).message,
      });
    }
  }

  async getGallery(req: Request, res: Response) {
    try {
      const gallery = await galleryService.findById(req.params.id as string);
      return res.status(200).json(gallery);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async createGallery(req: Request, res: Response) {
    try {
      const gallery = await galleryService.create(req.body);
      return res.status(200).json(gallery);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async deleteGallery(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await galleryService.remove(id as string);
      if (result) {
        return res.status(200).json({
          message: "Xóa gallery thành công",
          data: result,
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async deleteMultipleGallery(req: Request, res: Response) {
    const { ids } = req.body;
    try {
      const result = await galleryService.removeMultiple(ids);
      return res.status(200).json({
        message: "Xoá galleries thành công",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async updateGallery(req: Request, res: Response) {
    if (!req.params.id) {
      res.status(500).json({
        err_message: "ID is required",
      });
    }

    try {
      const gallery = await galleryService.update(
        req.params.id as string,
        req.body
      );
      return res.status(200).json(gallery);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }
}
