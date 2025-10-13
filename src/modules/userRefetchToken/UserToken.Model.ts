import mongoose from "mongoose";

const UserRefetchTokenSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    refresh_token: {
      type: String,
      required: true,
      unique: true,
    },
    expires_at: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserRefetchTokenModel = mongoose.model(
  "userRefetchToken",
  UserRefetchTokenSchema,
  "user_refetch_token"
);
