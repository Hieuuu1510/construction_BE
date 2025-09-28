import z from "zod";
import { Status } from "../../common/enums/status.enum.js";

export const NewsValidation = z.object({
  title: z.string().trim(),
  content: z.string().optional(),
  image: z.array(z.string()).optional(),
  news_category_id: z.string(),
  view_count: z.number().optional(),
  status: z.enum(Status).optional(),
});

export const NewsUpdateValidation = NewsValidation.partial();

// extract the inferred type
export type News = z.infer<typeof NewsValidation>;
export type NewsUpdate = z.infer<typeof NewsUpdateValidation>;
