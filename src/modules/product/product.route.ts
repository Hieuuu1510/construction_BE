import { Router } from "express";
import { ProductController } from "./product.controller.js";

const router = Router();
const productController = new ProductController();

router.post("/create", productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.delete("/:id", productController.deleteProduct);
router.put("/:id", productController.updateProduct);

export default router;
