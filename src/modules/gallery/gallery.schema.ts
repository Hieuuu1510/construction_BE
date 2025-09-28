import z from "zod";
import { GalleryType } from "../../common/enums/gallery.enum.js";
import { Status } from "../../common/enums/status.enum.js";

export const GalleryValidation = z.object({
  name: z.string().trim(),
  type: z.enum(GalleryType),
  image: z.string().optional(),
  status: z.enum(Status).optional(),
});

export const GalleryUpdateValidation = GalleryValidation.partial();

// extract the inferred type
export type Gallery = z.infer<typeof GalleryValidation>;
export type GalleryUpdate = z.infer<typeof GalleryUpdateValidation>;
