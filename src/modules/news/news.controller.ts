import type { Request, Response } from "express";
import { NewsService } from "./news.service.js";

const newsService = new NewsService();

export class NewsController {
  async getNews(req: Request, res: Response) {
    try {
      const news = await newsService.findMany(req.query);
      return res.status(200).json(news);
    } catch (err) {
      return res.status(500).json({
        error: (err as Error).message,
      });
    }
  }

  async getDetailNews(req: Request, res: Response) {
    try {
      const result = await newsService.findById(req.params.id as string);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async createNews(req: Request, res: Response) {
    try {
      const newsCreate = await newsService.create(req.body);
      return res.status(200).json(newsCreate);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async deleteNews(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await newsService.remove(id as string);

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

  async updateNews(req: Request, res: Response) {
    try {
      const newsUpdate = await newsService.update(
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
