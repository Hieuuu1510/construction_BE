import mongoose from "mongoose";
import { GalleryType } from "../../common/enums/gallery.enum.js";

const GallerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: GalleryType,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const GalleryModel = mongoose.model("Gallery", GallerySchema);
