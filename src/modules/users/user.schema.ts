import z from "zod";

export const userValidation = z.object({
  _id: z.string().optional(),
  username: z.string("username phải có kiểu string").trim(),
  password: z.string("password phải có kiểu string").trim(),
  email: z.email("email không hợp lệ").trim(),
  role: z.enum(["user"], "role không hợp lệ").optional(),
  status: z.boolean().optional(),
  new_password: z.string().min(6).optional(),
});

// pick email and password
export const userValidateLogin = userValidation.pick({
  email: true,
  password: true,
});

export const userValidateChangePass = userValidation.pick({
  password: true,
  new_password: true,
  email: true,
  _id: true,
});

export const userUpdateValidation = userValidation.partial();

// extract the inferred type
export type User = z.infer<typeof userValidation>;

export type UserUpdate = z.infer<typeof userUpdateValidation>;
