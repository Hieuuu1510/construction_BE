import { Router } from "express";
import productController from "./product.controller.js";

const router = Router();

router.post("/create", productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.delete("/:id", productController.deleteProduct);
router.put("/:id", productController.updateProduct);

export default router;
