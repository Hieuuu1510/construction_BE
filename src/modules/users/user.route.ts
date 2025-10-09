import { Router } from "express";

const router = Router();
import { UserController } from "./user.controller.js";

const userController = new UserController();

export default router;
