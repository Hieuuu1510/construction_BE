import mongoose from "mongoose";
import z from "zod";

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Id phải có kiểu dữ liệu ObjectId",
  });

export const constructionValidation = z.object({
  title: z.string().trim(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  construction_category_ids: z
    .array(objectIdSchema, "Danh mục phải là một mảng")
    .nonempty("Danh mục không được là mảng rỗng"),
  construction_count: z.number().optional(),
});

export const constructionUpdateValidation = constructionValidation.partial();

export type IConstruction = z.infer<typeof constructionValidation>;
export type IConstructionUpdate = z.infer<typeof constructionUpdateValidation>;
