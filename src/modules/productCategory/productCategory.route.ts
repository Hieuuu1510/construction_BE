import { Router } from "express";
import productCategoryController from "./productCategory.controller.js";

const router = Router();

router.post("/create", productCategoryController.createProductCategory);
router.get("/", productCategoryController.getProductCategories);
router.get("/:id", productCategoryController.getProductCategory);
router.delete("/:id", productCategoryController.deleteProductCategory);
router.put("/:id", productCategoryController.updateProductCategory);

export default router;
