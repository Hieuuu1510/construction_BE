import mongoose from "mongoose";
import z from "zod";

export const ProductValidation = z.object({
  name: z.string().trim(),
  description: z.string().optional(),
  image: z.array(z.string()).optional(),
  product_category_id: z.string(),
});

export const ProductUpdateValidation = ProductValidation.partial();

// extract the inferred type
export type Product = z.infer<typeof ProductValidation>;
export type ProductUpdate = z.infer<typeof ProductUpdateValidation>;
