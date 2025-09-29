import z from "zod";
import { Status } from "../../common/enums/status.enum.js";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Id phải có kiểu dữ liệu ObjectId",
  });

export const NewsValidation = z.object({
  title: z.string("title phải có kiểu dữ liệu là string").trim(),
  content: z.string("content phải có kiểu dữ liệu là string").optional(),
  image: z.array(z.string()).optional(),
  news_category_ids: z
    .array(objectIdSchema, {
      message: "Danh mục phải là một mảng",
    })
    .nonempty("Danh mục không được là mảng rỗng"),
  status: z
    .enum(Status, {
      message: "Trạng thái không hợp lệ",
    })
    .optional(),
});

export const NewsUpdateValidation = NewsValidation.partial();

// extract the inferred type
export type News = z.infer<typeof NewsValidation>;
export type NewsUpdate = z.infer<typeof NewsUpdateValidation>;
