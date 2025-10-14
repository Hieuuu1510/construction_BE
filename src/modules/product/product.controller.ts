import type { Request, Response } from "express";
import productService from "./product.service.js";

class ProductController {
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

    try {
      const result = await productService.remove(id as string);
      return res.status(200).json({
        message: "Delete product successfully",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const product = await productService.update(id as string, req.body);
      return res.status(200).json(product);
    } catch (err) {
      return res.status(400).json({
        error: (err as Error).message,
      });
    }
  }
}

export default new ProductController();
