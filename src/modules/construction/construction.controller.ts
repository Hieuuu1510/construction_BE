import type { Request, Response } from "express";
import constructionService from "./construction.service.js";

class ConstructionController {
  async getConstructions(req: Request, res: Response) {
    try {
      const constructions = await constructionService.findMany(req.query);
      return res.status(200).json(constructions);
    } catch (err) {
      return res.status(500).json({
        error: (err as Error).message,
      });
    }
  }

  async getDetailConstruction(req: Request, res: Response) {
    try {
      const result = await constructionService.findById(
        req.params.id as string
      );
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async createConstruction(req: Request, res: Response) {
    try {
      const constructionCreate = await constructionService.create(req.body);
      return res.status(200).json(constructionCreate);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async deleteConstruction(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await constructionService.remove(id as string);

      return res.status(200).json({
        message: "Xoá tin tức thành công",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async updateConstruction(req: Request, res: Response) {
    try {
      const constructionUpdate = await constructionService.update(
        req.params.id as string,
        req.body
      );
      return res.status(200).json(constructionUpdate);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }
}

export default new ConstructionController();
