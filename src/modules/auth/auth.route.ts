import { Router } from "express";
import { AuthController } from "./auth.controller.js";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authController.me);
router.put("/change-password", authController.changePass);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);

export default router;
