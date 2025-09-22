import type { Request, Response } from "express";
import { GalleryModel } from "./gallery.model.js";
import { Sort } from "../../common/enums/sort.enum.js";
import type { Gallery, GalleryUpdate } from "./gallery.schema.js";
import type { IFilterCommon } from "../../common/interfaces/filter.interface.js";

export class GalleryService {
  async findMany(filter: IFilterCommon) {
    const {
      page = 1,
      limit = 10,
      query = "",
      sort = Sort.DESC,
      column = "createdAt",
    } = filter;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      GalleryModel.find({
        name: {
          $regex: query, // tim kiem theo regex(biểu thức chính quy)
          $options: "i", // không phân biệt hoa thường
        },
      })
        .limit(limit)
        .skip(skip)
        .sort({ [column]: sort === Sort.DESC ? -1 : 1 }),
      GalleryModel.countDocuments(),
    ]);

    console.log(filter);

    return {
      data,
      total,
    };
  }

  async findById(id: string | number) {
    return await GalleryModel.findById(id);
  }

  async create(data: Gallery) {
    return GalleryModel.create(data);
  }

  async remove(id: string) {
    return GalleryModel.findByIdAndDelete(id);
  }

  async update(id: string, data: GalleryUpdate) {
    return GalleryModel.findByIdAndUpdate(id, data, { new: true });
  }
}
