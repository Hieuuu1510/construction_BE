import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ProductService } from "./product.service.js";
import {
  ProductUpdateValidation,
  ProductValidation,
} from "./product.schema.js";

const productService = new ProductService();

export class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const products = await productService.findMany(req.query);
      return res.status(200).json(products);
    } catch (err) {
      return res.status(500).json({
        error: (err as Error).message,
      });
    }
  }

  async getProduct(req: Request, res: Response) {
    if (!req.params.id) {
      res.status(500).json({
        err_message: "ID is required",
      });
    }
    try {
      const product = await productService.findById(req.params.id as string);
      return res.status(200).json(product);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      await ProductValidation.parseAsync(req.body);
      const product = await productService.create(req.body);
      return res.status(200).json(product);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      res.status(500).json({
        err_message: "ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        err_message: "The provided ID is not a valid MongoDB ObjectId",
      });
    }

    try {
      const productDetail = await productService.findById(id as string);

      if (!productDetail) {
        return res.status(400).json({
          err_message: "product not found",
        });
      }

      const result = await productService.remove(id as string);
      if (result) {
        return res.status(200).json({
          message: "Delete product successfully",
          data: result,
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async updateProduct(req: Request, res: Response) {
    if (!req.params.id) {
      res.status(500).json({
        err_message: "ID is required",
      });
    }

    try {
      const productDetail = await productService.findById(
        req.params.id as string
      );

      if (!productDetail) {
        return res.status(400).json({
          err_message: "product not found",
        });
      }

      await ProductUpdateValidation.parseAsync(req.body);
      const product = await productService.update(
        req.params.id as string,
        req.body
      );
      return res.status(200).json(product);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }
}
