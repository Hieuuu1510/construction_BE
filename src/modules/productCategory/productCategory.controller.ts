import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ProductCategoryService } from "./productCategory.service.js";
import {
  ProductCategoriesUpdateValidation,
  ProductCategoriesValidation,
} from "./productCategory.schema.js";
import { ProductModel } from "../product/product.model.js";

const productCategoryService = new ProductCategoryService();

export class ProductCategoryController {
  async getProductCategories(req: Request, res: Response) {
    try {
      const galleries = await productCategoryService.findMany(req.query);
      return res.status(200).json(galleries);
    } catch (err) {
      return res.status(500).json({
        error: (err as Error).message,
      });
    }
  }

  async getProductCategory(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const gallery = await productCategoryService.findById(id as string);
      return res.status(200).json(gallery);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async createProductCategory(req: Request, res: Response) {
    try {
      const gallery = await productCategoryService.create(req.body);
      return res.status(200).json(gallery);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async deleteProductCategory(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await productCategoryService.remove(id as string);

      return res.status(200).json({
        message: "Delete gallery successfully",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async updateProductCategory(req: Request, res: Response) {
    try {
      const gallery = await productCategoryService.update(
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
