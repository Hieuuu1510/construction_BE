import { Router } from "express";
import { ConstructionCategoryController } from "./constructionCategory.controller.js";

const constructionCategoryController = new ConstructionCategoryController();

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
