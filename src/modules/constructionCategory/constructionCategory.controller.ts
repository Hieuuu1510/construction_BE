import type { Request, Response } from "express";
import constructionCategoryService from "./constructionCategory.service.js";

class ConstructionCategoryController {
  async getConstructionCategories(req: Request, res: Response) {
    try {
      const news = await constructionCategoryService.findMany(req.query);
      return res.status(200).json(news);
    } catch (err) {
      return res.status(500).json({
        error: (err as Error).message,
      });
    }
  }

  async getDetailConstructionCategory(req: Request, res: Response) {
    try {
      const result = await constructionCategoryService.findById(
        req.params.id as string
      );
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async createConstructionCategory(req: Request, res: Response) {
    try {
      const newsCreate = await constructionCategoryService.create(req.body);
      return res.status(200).json(newsCreate);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async deleteConstructionCategory(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await constructionCategoryService.remove(id as string);

      return res.status(200).json({
        message: "Xoá danh mục thành công",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async updateConstructionCategory(req: Request, res: Response) {
    try {
      const newsUpdate = await constructionCategoryService.update(
        req.params.id as string,
        req.body
      );
      return res.status(200).json(newsUpdate);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }
}

export default new ConstructionCategoryController();
