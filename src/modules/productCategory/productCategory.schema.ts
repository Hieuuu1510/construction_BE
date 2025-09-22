import z from "zod";

export const ProductCategoriesValidation = z.object({
  name: z.string().trim(),
});

export const ProductCategoriesUpdateValidation =
  ProductCategoriesValidation.partial();

// extract the inferred type
export type ProductCategories = z.infer<typeof ProductCategoriesValidation>;
export type ProductCategoriesUpdate = z.infer<
  typeof ProductCategoriesUpdateValidation
>;
