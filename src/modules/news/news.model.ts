import mongoose from "mongoose";
import { generateSlug } from "../../common/utils/generateSlug.js";
import { Status } from "../../common/enums/status.enum.js";

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    news_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "newsCategory",
      require: true,
    },
    cover: {
      type: String,
    },
    view_count: {
      type: Number,
      default: 0,
      min: 0,
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
NewsSchema.pre("save", async function (next) {
  const Model = this.constructor; // trỏ đến model hiện tại
  if (this.isModified("title") || this.isNew) {
    this.slug = await generateSlug(this.title, this._id, Model);
  }

  next();
});

NewsSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  const query = this.getQuery();
  const Model = this.model; // trỏ đến model hiện tại

  if (update.title) {
    update.slug = await generateSlug(update.title, query._id, Model);
  }
  next();
});

export const NewsModel = mongoose.model("News", NewsSchema);
