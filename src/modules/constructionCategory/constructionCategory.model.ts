import mongoose from "mongoose";
import { generateSlug } from "../../common/utils/generateSlug.js";
import { Status } from "../../common/enums/status.enum.js";

const constructionCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
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

// middleware
constructionCategorySchema.pre("save", async function (next) {
  const Model = this.constructor; // trỏ đến model hiện tại
  if (this.isModified("name") || this.isNew) {
    this.slug = await generateSlug(this.name, this._id, Model);
  }
  next();
});

constructionCategorySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  const query = this.getQuery();

  if (update.name) {
    update.slug = await generateSlug(update.name, query._id, this.model);
  }
  next();
});

// thi công
export const ConstructionCategoryModel = mongoose.model(
  "constructionCategory",
  constructionCategorySchema,
  "construction_category"
);
