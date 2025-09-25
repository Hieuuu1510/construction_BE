import mongoose from "mongoose";
import { generateSlug } from "../../common/utils/generateSlug.js";

const NewsCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// middleware
NewsCategorySchema.pre("save", async function (next) {
  const Model = this.constructor; // trỏ đến model hiện tại
  if (this.isModified("name") || this.isNew) {
    this.slug = await generateSlug(this.name, this._id, Model);
  }

  next();
});

NewsCategorySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  const query = this.getQuery();
  const Model = this.model; // trỏ đến model hiện tại

  if (update.name) {
    update.slug = await generateSlug(update.name, query._id, Model);
  }
  next();
});

export const NewsCategoryModel = mongoose.model(
  "newsCategory",
  NewsCategorySchema,
  "news_category"
);
