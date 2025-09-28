import z from "zod";
import { Status } from "../../common/enums/status.enum.js";

export const ProductCategoriesValidation = z.object({
  name: z.string().trim(),
  status: z.enum(Status).optional(),
});

export const ProductCategoriesUpdateValidation =
  ProductCategoriesValidation.partial();

// extract the inferred type
export type ProductCategories = z.infer<typeof ProductCategoriesValidation>;
export type ProductCategoriesUpdate = z.infer<
  typeof ProductCategoriesUpdateValidation
>;
