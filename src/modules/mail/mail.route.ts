import { Router } from "express";
import mailController from "./mail.controller.js";

const route = Router();

route.post("/send-otp", mailController.sendOtpEmail);
route.post("/verify-otp", mailController.verifyOtpEmail);

export default route;
