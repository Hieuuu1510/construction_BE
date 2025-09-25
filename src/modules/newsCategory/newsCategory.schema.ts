import z from "zod";

export const NewsCategoriesValidation = z.object({
  name: z.string().trim(),
});

export const NewsCategoriesUpdateValidation =
  NewsCategoriesValidation.partial();

// extract the inferred type
export type NewsCategories = z.infer<typeof NewsCategoriesValidation>;
export type NewsCategoriesUpdate = z.infer<
  typeof NewsCategoriesUpdateValidation
>;
