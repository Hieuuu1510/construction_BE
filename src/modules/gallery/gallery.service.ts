import { GalleryModel } from "./gallery.model.js";
import { Sort } from "../../common/enums/sort.enum.js";
import {
  GalleryUpdateValidation,
  GalleryValidation,
  type Gallery,
  type GalleryUpdate,
} from "./gallery.schema.js";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";
import httpError from "../../common/helper/httpError.helper.js";
import mongoose from "mongoose";

class GalleryService {
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

    const baseQuery = GalleryModel.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort({ [column]: sort === Sort.DESC ? -1 : 1 });

    const [data, total] = await Promise.all([
      baseQuery,
      GalleryModel.countDocuments(),
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

    const galleryDetail = await GalleryModel.findById(id);

    if (!galleryDetail) {
      throw new httpError(400, "Gallery không tồn tại");
    }

    return galleryDetail;
  }

  async create(data: Gallery) {
    await GalleryValidation.parseAsync(data);
    const resultCreate = await GalleryModel.create(data);

    if (!resultCreate) {
      throw new httpError(500, "Tạo gallery thất bại");
    }

    return resultCreate;
  }

  async remove(id: string) {
    const galleryDetail = await this.findById(id);

    if (!galleryDetail) {
      throw new httpError(400, "Gallery không tồn tại");
    }

    const resultDelete = await GalleryModel.findByIdAndDelete(id);

    if (!resultDelete) {
      throw new httpError(500, "Xoá gallery thất bại");
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

    const resultDeletes = await GalleryModel.deleteMany({
      _id: { $in: ids },
    });

    if (!resultDeletes) {
      throw new httpError(500, "Xoá gallery thất bại");
    }

    return resultDeletes;
  }

  async update(id: string, data: GalleryUpdate) {
    const galleryDetail = await this.findById(id);

    if (!galleryDetail) {
      throw new httpError(400, "Gallery không tồn tại");
    }

    await GalleryUpdateValidation.parseAsync(data);

    const resultUpdate = await GalleryModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!resultUpdate) {
      throw new httpError(500, "Cập nhật gallery thất bại");
    }

    return resultUpdate;
  }
}

export default new GalleryService();
