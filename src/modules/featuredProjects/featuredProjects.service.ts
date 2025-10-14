import { FeaturedProjectsModel } from "./featuredProjects.model.js";
import { Sort } from "../../common/enums/sort.enum.js";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";
import httpError from "../../common/helper/httpError.helper.js";
import mongoose from "mongoose";
import {
  FeaturedProjectsUpdateValidation,
  FeaturedProjectsValidation,
  type FeaturedProjects,
  type FeaturedProjectsUpdate,
} from "./featuredProjects.schema.js";

class FeaturedProjectsService {
  async findMany(filter: IFilterCommon) {
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
        { name: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
      ];
    }

    const baseQuery = FeaturedProjectsModel.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort({ [column]: sort === Sort.DESC ? -1 : 1 });

    const [data, total] = await Promise.all([
      baseQuery,
      FeaturedProjectsModel.countDocuments(queryObj),
    ]);

    return {
      data,
      total,
    };
  }

  async findById(id: string | number) {
    if (!id) {
      throw new httpError(400, "ID không được để trống");
    }

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      throw new httpError(400, "ID phải có kiểu dữ liệu ObjectId");
    }

    const Detail = await FeaturedProjectsModel.findById(id);

    if (!Detail) {
      throw new httpError(400, "công trình tiêu biểu không tồn tại");
    }

    return Detail;
  }

  async create(data: FeaturedProjects) {
    await FeaturedProjectsValidation.parseAsync(data);
    const resultCreate = await FeaturedProjectsModel.create(data);

    if (!resultCreate) {
      throw new httpError(500, "Tạo công trình tiêu biểu thất bại");
    }

    return resultCreate;
  }

  async remove(id: string) {
    const Detail = await this.findById(id);

    if (!Detail) {
      throw new httpError(400, "Công trình tiêu biểu không tồn tại");
    }

    const resultDelete = await FeaturedProjectsModel.findByIdAndDelete(id);

    if (!resultDelete) {
      throw new httpError(500, "Xoá công trình tiêu biểu thất bại");
    }

    return resultDelete;
  }

  async removeMultiple(ids: string[]) {
    if (ids.length === 0 || !Array.isArray(ids)) {
      throw new httpError(400, "ids không được là mảng rỗng");
    }

    const isValid = ids.every((id) => mongoose.Types.ObjectId.isValid(id));
    if (!isValid) {
      throw new httpError(400, "ID phải có kiểu dữ liệu ObjectId");
    }

    const resultDeletes = await FeaturedProjectsModel.deleteMany({
      _id: { $in: ids },
    });

    if (!resultDeletes) {
      throw new httpError(500, "Xoá công trình tiêu biểu thất bại");
    }

    return resultDeletes;
  }

  async update(id: string, data: FeaturedProjectsUpdate) {
    const galleryDetail = await this.findById(id);

    if (!galleryDetail) {
      throw new httpError(400, "Công trình tiêu biểu không tồn tại");
    }

    await FeaturedProjectsUpdateValidation.parseAsync(data);

    const resultUpdate = await FeaturedProjectsModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );

    if (!resultUpdate) {
      throw new httpError(500, "Cập nhật công trình tiêu biểu thất bại");
    }

    return resultUpdate;
  }
}

export default new FeaturedProjectsService();
