import type { Request, Response } from "express";
import mailService from "./mail.service.js";

class MailController {
  async sendOtpEmail(req: Request, res: Response) {
    const { email } = req.body;
    const result = await mailService.sendOtpEmail(email);
    return res.status(200).json(result);
  }

  async verifyOtpEmail(req: Request, res: Response) {
    const { email, otp } = req.body;
    const result = await mailService.verifyOtpEmail(email, otp);
    return res.status(200).json(result);
  }
}

export default new MailController();
