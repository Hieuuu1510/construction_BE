import mongoose from "mongoose";
import { generateSlug } from "../../common/utils/generateSlug.js";
import trackUserActions from "../../middleware/trackUserAction.js";

const FeaturedProjectsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    slug: {
      type: String,
      unique: true,
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

trackUserActions(FeaturedProjectsSchema);

FeaturedProjectsSchema.pre("save", async function (next) {
  const Model = this.constructor; // trỏ đến model hiện tại
  if (this.isModified("name") || this.isNew) {
    this.slug = await generateSlug(this.name, this._id, Model);
  }
  next();
});

FeaturedProjectsSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  const query = this.getQuery();

  if (update?.name) {
    update.slug = await generateSlug(update.name, query._id, this.model);
  }
  next();
});

export const FeaturedProjectsModel = mongoose.model(
  "featuredProjects",
  FeaturedProjectsSchema,
  "featured_projects"
);
