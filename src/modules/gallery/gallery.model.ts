import mongoose from "mongoose";
import { GalleryType } from "../../common/enums/gallery.enum.js";
import { Status } from "../../common/enums/status.enum.js";
import trackUserActions from "../../middleware/trackUserAction.js";

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
    created_uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    update_uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// middleware
trackUserActions(GallerySchema);

export const GalleryModel = mongoose.model("Gallery", GallerySchema);
