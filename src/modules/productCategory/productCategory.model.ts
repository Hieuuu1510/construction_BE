import mongoose from "mongoose";
import { generateSlug } from "../../common/utils/generateSlug.js";
import { Status } from "../../common/enums/status.enum.js";
import trackUserActions from "../../middleware/trackUserAction.js";

const ProductCategorySchema = new mongoose.Schema(
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

trackUserActions(ProductCategorySchema);
ProductCategorySchema.pre("save", async function (next) {
  const Model = this.constructor; // trỏ đến model hiện tại
  if (this.isModified("name") || this.isNew) {
    this.slug = await generateSlug(this.name, this._id, Model);
  }

  next();
});

ProductCategorySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  const query = this.getQuery();
  const Model = this.model; // trỏ đến model hiện tại

  if (update.name) {
    update.slug = await generateSlug(update.name, query._id, Model);
  }
  next();
});

// Kinh doanh
export const ProductCategoryModel = mongoose.model(
  "productCategory",
  ProductCategorySchema,
  "product_category"
);
