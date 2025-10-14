import type { Request, Response } from "express";
import newsCategoryService from "./newsCategory.service.js";

class NewsCategoryController {
  async getNewsCategories(req: Request, res: Response) {
    try {
      const results = await newsCategoryService.findMany(req.query);
      return res.status(200).json(results);
    } catch (err) {
      return res.status(500).json({
        error: (err as Error).message,
      });
    }
  }

  async getNewsCategory(req: Request, res: Response) {
    try {
      const result = await newsCategoryService.findById(
        req.params.id as string
      );
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async createNewsCategory(req: Request, res: Response) {
    try {
      const data = await newsCategoryService.create(req.body);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async deleteNewsCategory(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await newsCategoryService.remove(id as string);

      return res.status(200).json({
        message: "Xoá danh mục tin tức thành công",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async updateNewsCategory(req: Request, res: Response) {
    try {
      const resultUpdate = await newsCategoryService.update(
        req.params.id as string,
        req.body
      );
      return res.status(200).json(resultUpdate);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }
}

export default new NewsCategoryController();
