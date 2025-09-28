import z from "zod";

export const ConstructionCategoriesValidation = z.object({
  name: z.string().trim(),
});

export const ConstructionCategoriesUpdateValidation =
  ConstructionCategoriesValidation.partial();

export type IConstructionCategory = z.infer<
  typeof ConstructionCategoriesValidation
>;

export type IConstructionCategoryUpdate = z.infer<
  typeof ConstructionCategoriesUpdateValidation
>;
