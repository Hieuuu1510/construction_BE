import z from "zod";

export const mailValidation = z.object({
  email: z.email({ message: "email không hợp lệ" }),
  otp: z.number().int(),
});

export const sendOtpEmailValidation = mailValidation.pick({
  email: true,
});

export type mailValidation = z.infer<typeof mailValidation>;
