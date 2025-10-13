import type { ObjectId } from "mongoose";

export interface baseEntity {
  _id: string | ObjectId;
  created_at: Date;
  updated_at: Date;
}
