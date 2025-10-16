import mongoose from "mongoose";
import { generateSlug } from "../../common/utils/generateSlug.js";
import { Status } from "../../common/enums/status.enum.js";
import trackUserActions from "../../middleware/trackUserAction.js";

const constructionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    images: {
      type: [String],
      default: [],
    },
    content: {
      type: String,
    },
    status: {
      type: String,
      enum: Status,
      default: Status.ACTIVE,
    },
    construction_category_ids: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "constructionCategory",
          required: true,
        },
      ],
      default: [],
    },
    view_count: {
      type: Number,
      default: 0,
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

trackUserActions(constructionSchema);

constructionSchema.pre("save", async function (next) {
  const Model = this.constructor; // trỏ đến model hiện tại
  if (this.isModified("title") || this.isNew) {
    this.slug = await generateSlug(this.title, this._id, Model);
  }
  next();
});

constructionSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  const query = this.getQuery();

  if (update.title) {
    update.slug = await generateSlug(update.title, query._id, this.model);
  }
  next();
});

export const ConstructionModel = mongoose.model(
  "Construction",
  constructionSchema
);
