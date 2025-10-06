import z from "zod";

export const userValidation = z.object({
  username: z.string().trim(),
  password: z.string().trim(),
  email: z.email().trim(),
  role: z.enum(["user"], "role phải là user").optional(),
  status: z.boolean().optional(),
});

// pick email and password
export const userValidateLogin = userValidation.pick({
  email: true,
  password: true,
});

export const userUpdateValidation = userValidation.partial();

// extract the inferred type
export type User = z.infer<typeof userValidation>;

export type UserUpdate = z.infer<typeof userUpdateValidation>;
