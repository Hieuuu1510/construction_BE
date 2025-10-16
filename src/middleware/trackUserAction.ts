import type mongoose from "mongoose";
import { als } from "./requestContext.js";

function trackUserActions(schema: mongoose.Schema) {
  schema.pre("save", function (next) {
    const store = als.getStore();
    if (store?.userId) {
      if (this.isNew) this.created_uid = store.userId;
      else this.update_uid = store.userId;
    }
    if (this.isNew && store?.userId) {
      this.created_uid = store.userId;
      this.update_uid = store.userId;
    } else if (store?.userId) {
      this.update_uid = store.userId;
    }
    next();
  });

  schema.pre("findOneAndUpdate", function (next) {
    const update: any = this.getUpdate();
    const store = als.getStore();
    if (store?.userId) {
      update.update_uid = store.userId;
    }
    next();
  });
}

export default trackUserActions;
