import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { middlewareTokenAuth } from "../../middleware/auth.js";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", middlewareTokenAuth, authController.me);
router.put("/change-password", middlewareTokenAuth, authController.changePass);
router.post("/logout", middlewareTokenAuth, authController.logout);
router.post("/refresh-token", authController.refreshToken);

export default router;
