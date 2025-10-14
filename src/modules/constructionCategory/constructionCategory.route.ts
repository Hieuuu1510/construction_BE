import { Router } from "express";
import constructionCategoryController from "./constructionCategory.controller.js";

const router = Router();

router.get("/", constructionCategoryController.getConstructionCategories);
router.get(
  "/:id",
  constructionCategoryController.getDetailConstructionCategory
);
router.post(
  "/create",
  constructionCategoryController.createConstructionCategory
);
router.delete(
  "/:id",
  constructionCategoryController.deleteConstructionCategory
);
router.put("/:id", constructionCategoryController.updateConstructionCategory);

export default router;
