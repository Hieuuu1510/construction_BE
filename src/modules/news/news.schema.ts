import z from "zod";

export const NewsValidation = z.object({
  title: z.string().trim(),
  content: z.string().optional(),
  image: z.array(z.string()).optional(),
  news_category_id: z.string(),
});

export const NewsUpdateValidation = NewsValidation.partial();

// extract the inferred type
export type News = z.infer<typeof NewsValidation>;
export type NewsUpdate = z.infer<typeof NewsUpdateValidation>;
