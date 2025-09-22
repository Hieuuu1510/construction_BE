import { Router } from "express";
import { ProductCategoryController } from "./productCategory.controller.js";

const router = Router();
const productCategoryController = new ProductCategoryController();

router.post("/create", productCategoryController.createProductCategory);
router.get("/", productCategoryController.getProductCategories);
router.get("/:id", productCategoryController.getProductCategory);
router.delete("/:id", productCategoryController.deleteProductCategory);
router.put("/:id", productCategoryController.updateProductCategory);

export default router;
