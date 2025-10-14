import { Router } from "express";
import newsController from "./news.controller.js";

const router = Router();

router.post("/create", newsController.createNews);
router.get("/", newsController.getNews);
router.get("/:id", newsController.getDetailNews);
router.delete("/:id", newsController.deleteNews);
router.put("/:id", newsController.updateNews);

export default router;
