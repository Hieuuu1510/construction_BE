import mongoose from "mongoose";
import { GalleryType } from "../../common/enums/gallery.enum.js";
import { Status } from "../../common/enums/status.enum.js";

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
    status: {
      type: String,
      enum: Status,
      default: Status.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const GalleryModel = mongoose.model("Gallery", GallerySchema);
