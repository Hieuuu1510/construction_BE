import mongoose from "mongoose";
import z from "zod";

const objIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "ID phải có kiểu dữ liệu ObjectId",
  })
  .transform((val) => new mongoose.Types.ObjectId(val));

const objectIdArraySchema = z
  .array(objIdSchema)
  .nonempty("Danh sách ID không được để trống");

export function parseObjectIdArray(ids: string[]): mongoose.Types.ObjectId[] {
  const parseIds = objectIdArraySchema.parse(ids);

  return parseIds;
}

export function parseObjectId(id: string): mongoose.Types.ObjectId {
  const parseId = objIdSchema.parse(id);

  return parseId;
}
