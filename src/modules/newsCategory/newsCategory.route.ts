import { Router } from "express";
import { NewsCategoryController } from "./newsCategory.controller.js";

const router = Router();
const newsCategoryController = new NewsCategoryController();

router.post("/create", newsCategoryController.createNewsCategory);
router.get("/", newsCategoryController.getNewsCategories);
router.get("/:id", newsCategoryController.getNewsCategory);
router.delete("/:id", newsCategoryController.deleteNewsCategory);
router.put("/:id", newsCategoryController.updateNewsCategory);

export default router;
