import { Router } from "express";
import authController from "./auth.controller.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authController.me);
router.put("/change-password", authController.changePass);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);

export default router;
