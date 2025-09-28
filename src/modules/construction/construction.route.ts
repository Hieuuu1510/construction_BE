import { Router } from "express";
import { ConstructionController } from "./construction.controller.js";

const constructionController = new ConstructionController();

const router = Router();

router.get("/", constructionController.getConstructions);
router.get("/:id", constructionController.getDetailConstruction);
router.post("/create", constructionController.createConstruction);
router.delete("/:id", constructionController.deleteConstruction);
router.put("/:id", constructionController.updateConstruction);

export default router;
