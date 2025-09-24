import mongoose from "mongoose";
import { generateSlug } from "../../common/utils/generateSlug.js";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    product_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productCategory",
      require: true,
    },
    image: {
      type: [String],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// middleware
ProductSchema.pre("save", async function (next) {
  const Model = this.constructor; // trỏ đến model hiện tại
  if (this.isModified("name") || this.isNew) {
    this.slug = await generateSlug(this.name, this._id, Model);
  }

  next();
});

ProductSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  const query = this.getQuery();
  const Model = this.model; // trỏ đến model hiện tại

  if (update.name) {
    update.slug = await generateSlug(update.name, query._id, Model);
  }
  next();
});

export const ProductModel = mongoose.model("Product", ProductSchema);
