import z from "zod";

export const FeaturedProjectsValidation = z.object({
  name: z.string("name phải có kiểu dữ liệu là string").trim(),
  images: z.array(z.string(), "images phải là mảng").optional(),
});

export const FeaturedProjectsUpdateValidation =
  FeaturedProjectsValidation.partial();

// extract the inferred type
export type FeaturedProjects = z.infer<typeof FeaturedProjectsValidation>;
export type FeaturedProjectsUpdate = z.infer<
  typeof FeaturedProjectsUpdateValidation
>;
