import z from "zod";

export const ContactValidation = z.object({
  name: z
    .string("name không được để trống")
    .trim()
    .refine((val) => val, {
      message: "name không được để trống",
    }),
  email: z
    .email("kiểu dữ liệu không hợp lệ")
    .trim()
    .refine((val) => !val, {
      message: "email không được để trống",
    }),
  phone: z.number().refine((val) => !val, {
    message: "phone không được để trống",
  }),
  title: z.string().trim(),
  message: z.string().trim(),
});

export type Contact = z.infer<typeof ContactValidation>;
