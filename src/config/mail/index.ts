import nodemailer from "nodemailer";
import httpError from "../../common/helper/httpError.helper.js";

// khởi tạo đối tượng gửi mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

await transporter.verify().catch((error) => {
  throw new httpError(500, "Gmail không kết nối được");
});

console.log("Gmail connected");

export default transporter;
