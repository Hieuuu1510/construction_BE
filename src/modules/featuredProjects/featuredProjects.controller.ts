import type { Request, Response } from "express";
import mongoose from "mongoose";
import { FeaturedProjectsService } from "./featuredProjects.service.js";

const featuredProjectsService = new FeaturedProjectsService();

export class FeaturedProjectsController {
  async getFeaturedProjects(req: Request, res: Response) {
    try {
      const featuredProjects = await featuredProjectsService.findMany(
        req.query
      );
      return res.status(200).json(featuredProjects);
    } catch (err) {
      return res.status(500).json({
        error: (err as Error).message,
      });
    }
  }

  async getFeaturedProject(req: Request, res: Response) {
    try {
      const featuredProject = await featuredProjectsService.findById(
        req.params.id as string
      );
      return res.status(200).json(featuredProject);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async createFeaturedProject(req: Request, res: Response) {
    try {
      const featuredProject = await featuredProjectsService.create(req.body);
      return res.status(200).json(featuredProject);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async deleteFeaturedProject(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await featuredProjectsService.remove(id as string);
      if (result) {
        return res.status(200).json({
          message: "Xóa công trình tiêu biểu thành công",
          data: result,
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async deleteMultipleFeaturedProject(req: Request, res: Response) {
    const { ids } = req.body;
    console.log(ids);
    try {
      const result = await featuredProjectsService.removeMultiple(ids);
      return res.status(200).json({
        message: "Xoá công trình tiêu biểu thành công",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async updateFeaturedProject(req: Request, res: Response) {
    try {
      const gallery = await featuredProjectsService.update(
        req.params.id as string,
        req.body
      );
      return res.status(200).json({
        message: "Cập nhật công trình tiêu biểu thành công",
        data: gallery,
      });
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }
}
