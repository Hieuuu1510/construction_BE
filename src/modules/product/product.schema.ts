import mongoose from "mongoose";
import z from "zod";
import { Status } from "../../common/enums/status.enum.js";

export const ProductValidation = z.object({
  name: z.string().trim(),
  description: z.string().optional(),
  image: z.array(z.string()).optional(),
  product_category_id: z.string(),
  status: z.enum(Status).optional(),
});

export const ProductUpdateValidation = ProductValidation.partial();

// extract the inferred type
export type Product = z.infer<typeof ProductValidation>;
export type ProductUpdate = z.infer<typeof ProductUpdateValidation>;
