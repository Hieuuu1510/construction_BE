import z from "zod";
import { Status } from "../../common/enums/status.enum.js";

export const NewsCategoriesValidation = z.object({
  name: z.string().trim(),
  status: z.enum(Status).optional(),
});

export const NewsCategoriesUpdateValidation =
  NewsCategoriesValidation.partial();

// extract the inferred type
export type NewsCategories = z.infer<typeof NewsCategoriesValidation>;
export type NewsCategoriesUpdate = z.infer<
  typeof NewsCategoriesUpdateValidation
>;
