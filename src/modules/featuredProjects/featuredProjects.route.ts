import { Router } from "express";
import { FeaturedProjectsController } from "./featuredProjects.controller.js";

const router = Router();
const featuredProjectsController = new FeaturedProjectsController();

router.post("/create", featuredProjectsController.createFeaturedProject);
router.get("/", featuredProjectsController.getFeaturedProjects);
router.post(
  "/delete-many",
  featuredProjectsController.deleteMultipleFeaturedProject
);
router.get("/:id", featuredProjectsController.getFeaturedProject);
router.delete("/:id", featuredProjectsController.deleteFeaturedProject);
router.put("/:id", featuredProjectsController.updateFeaturedProject);

export default router;
