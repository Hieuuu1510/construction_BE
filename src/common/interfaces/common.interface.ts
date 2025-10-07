import type { ObjectId } from "mongoose";

export interface baseEntity {
  _id: string | ObjectId;
}
