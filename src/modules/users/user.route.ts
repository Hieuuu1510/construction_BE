import { Router } from "express";
import userController from "./user.controller.js";

const router = Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getById);
router.post("/create", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);

export default router;
