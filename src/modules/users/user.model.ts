import mongoose, { Schema } from "mongoose";
import { Role } from "../../common/enums/role.enum.js";
import { UserStatus } from "../../common/enums/status.enum.js";
import type { IUser, IUserMethods } from "./user.interface.js";
import trackUserActions from "../../middleware/trackUserAction.js";

// IUser : fields, {} : static, IUserMethods : methods
type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "username không được để trống"],
      trim: true,
      minLength: [3, "username phải nhất 3 ký tự"],
    },
    email: {
      type: String,
      required: [true, "email không được để trống"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
    },
    password: {
      type: String,
      required: [true, "password không được để trống"],
      minLength: [6, "password phải nhất 6 ký tự"],
      select: false,
    },
    phone: {
      type: String,
      required: [true, "phone không được để trống"],
      unique: [true, "Số điện thoại đã được đăng ký"],
      trim: true,
      match: [/^[0-9]+$/, "Số điện thoại không hợp lệ"],
    },
    role: {
      type: String,
      enum: [Role.USER],
      default: Role.USER,
    },
    status: {
      type: String,
      enum: UserStatus,
      default: UserStatus.INACTIVE,
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
trackUserActions(UserSchema);

export const UserModel = mongoose.model<IUser>("user", UserSchema);
