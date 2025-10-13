import httpError from "../../common/helper/httpError.helper.js";
import type { IFilterUser, IUser } from "./user.interface.js";
import { UserModel } from "./user.model.js";
import { userUpdateValidation, userValidation } from "./user.schema.js";
import { AuthService } from "../auth/auth.service.js";
import { Sort } from "../../common/enums/sort.enum.js";
import mongoose from "mongoose";

const authService = new AuthService();

export class UserService {
  async getMany(filter: IFilterUser) {
    const {
      page = 1,
      limit = 10,
      query,
      sort = Sort.DESC,
      column = "createdAt",
    } = filter;

    const skip = (page - 1) * limit;
    const queryObj: any = {};

    if (query) {
      queryObj.$or = [
        {
          email: {
            $regex: query,
            $options: "i",
          },
        },
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
      ];
    }

    const baseQuery = UserModel.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort({ [column]: sort === Sort.DESC ? -1 : 1 });

    if (filter?.is_user === "true") {
      baseQuery.populate("user_id");
    }

    const [data, total] = await Promise.all([
      baseQuery,
      UserModel.countDocuments(queryObj),
    ]);

    return {
      data,
      total,
    };
  }

  async getById(id: string) {
    if (!id) {
      throw new httpError(400, "Id không được để trống");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new httpError(400, "Id không hợp lệ");
    }

    const userDetail = await UserModel.findById(id);

    return userDetail;
  }

  async create(user: IUser) {
    userValidation.parse(user);

    const resultCreate = await UserModel.create(user);

    if (!resultCreate) {
      throw new httpError(400, "Tạo user thất bại");
    }

    return resultCreate;
  }

  async update(id: string, user: IUser) {
    const userDetail = await this.getById(id);

    if (!userDetail) {
      throw new httpError(404, "User không tồn tại");
    }

    userUpdateValidation.parse(user);

    const resultUpdate = await UserModel.findByIdAndUpdate(id, user, {
      new: true,
    });

    if (!resultUpdate) {
      throw new httpError(400, "Cập nhật user thất bại");
    }

    return resultUpdate;
  }

  async remove(id: string) {
    const userDetail = await this.getById(id);

    if (!userDetail) {
      throw new httpError(404, "User không tồn tại");
    }

    const resultRemove = await UserModel.findByIdAndDelete(id);

    if (!resultRemove) {
      throw new httpError(400, "Xóa user thất bại");
    }

    return resultRemove;
  }
}
