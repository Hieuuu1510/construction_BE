import z from "zod";

export const constructionValidation = z.object({
  title: z.string().trim(),
  description: z.string().optional(),
  image: z.array(z.string()).optional(),
  construction_category_id: z.string(),
  construction_count: z.number().optional(),
});

export const constructionUpdateValidation = constructionValidation.partial();

export type IConstruction = z.infer<typeof constructionValidation>;
export type IConstructionUpdate = z.infer<typeof constructionUpdateValidation>;
