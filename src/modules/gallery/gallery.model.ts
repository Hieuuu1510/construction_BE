import mongoose from "mongoose";
import { galleryType } from "../../common/enums/gallery.enum.js";


const GallerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: galleryType
  },
  image: {
    type: String
  }
}, {
  timestamps: true
});

export const GalleryModel = new mongoose.Model('Gallery', GallerySchema);