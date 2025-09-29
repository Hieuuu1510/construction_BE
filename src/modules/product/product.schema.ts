import mongoose from "mongoose";
import z from "zod";
import { Status } from "../../common/enums/status.enum.js";

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Id phải có kiểu dữ liệu ObjectId",
  });

export const ProductValidation = z.object({
  name: z.string("name phải có kiểu dữ liệu là string").trim(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  product_category_ids: z
    .array(objectIdSchema, {
      message: "Danh mục phải là một mảng",
    })
    .nonempty("Danh mục không được là mảng rỗng"),
  status: z.enum(Status, "Trạng thái không hợp lệ").optional(),
});

export const ProductUpdateValidation = ProductValidation.partial();

// extract the inferred type
export type Product = z.infer<typeof ProductValidation>;
export type ProductUpdate = z.infer<typeof ProductUpdateValidation>;
