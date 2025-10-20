import { Status } from "../../common/enums/status.enum.js";
import httpError from "../../common/helper/httpError.helper.js";
import { generateOtp } from "../../common/utils/generateOtp.js";
import transporter from "../../config/mail/index.js";
import client from "../../config/redis/index.js";
import { UserModel } from "../users/user.model.js";
import { mailValidation, sendOtpEmailValidation } from "./mail.schema.js";

class mailService {
  async sendOtpEmail(email: string) {
    try {
      await sendOtpEmailValidation.parseAsync({ email });
      const generateCode = generateOtp();
      const redisKey = `otp:${email}`;
      const expires = 5 * 60; // 5 phút
      await transporter.sendMail({
        from: `Hiếu bão tố <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Mã xác nhận email",
        html: `Mã xác nhận của bạn là: ${generateCode}. Hãy nhập mã này để xác nhận email. Mã này có hiệu lực trong 5 phút.`,
      });

      await client.set(redisKey, generateCode, {
        EX: expires,
      });

      return {
        message: "Gửi otp thành công",
      };
    } catch (error) {
      console.log(error);
      throw new httpError(500, "Gửi email thất bại");
    }
  }

  async verifyOtpEmail(email: string, otp: string) {
    // check email tồn tại trong db chưa
    // check expires của otp còn hiệu lực không
    // check otp có chính xác không
    try {
      await mailValidation.parseAsync({ email, otp });
      const redisKeyByEmail = await client.get(`otp:${email}`);

      console.log(redisKeyByEmail);

      const resultUserByEmail = await UserModel.findOne({ email });
      if (!resultUserByEmail) {
        throw new httpError(404, "Email không tồn tại");
      }

      if (redisKeyByEmail !== otp) {
        throw new httpError(400, "Otp không chính xác");
      }

      // update user
      await UserModel.updateOne({ email }, { status: Status.ACTIVE });

      return {
        message: "Xác nhận otp thành công",
      };
    } catch (error) {
      console.log(error);
      throw new httpError(500, "Xác nhận otp thất bại");
    }
  }

  async sendEmailByContactUser(email: string) {
    try {
      await sendOtpEmailValidation.parseAsync({ email });
      await transporter.sendMail({
        from: "Hiếu bão tố",
        to: process.env.GMAIL_USER,
        subject: "có khách hàng mới liên hệ với bạn",
        html: `có khách hàng mới <${email}> liên hệ với bạn. Hãy kiểm tra mail ngày nhé!!!`,
      });
    } catch (error) {
      console.log(error);
      throw new httpError(500, "Gửi mail thất bại");
    }
  }
}

export default new mailService();
