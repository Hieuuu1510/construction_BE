import crypto from "crypto";
import { UserRefetchTokenModel } from "./UserToken.Model.js";
import httpError from "../../common/helper/httpError.helper.js";
import type { populate } from "dotenv";

export class UserRefetchTokenService {
  async createUserRefetchToken(user_id: string) {
    const refresh_token = crypto.randomBytes(64).toString("hex");
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const userRefetchToken = new UserRefetchTokenModel({
      user_id,
      refresh_token,
      expires_at,
    });

    await userRefetchToken.save();

    return userRefetchToken;
  }

  async verifyUserRefetchToken(refresh_token: string) {
    const userRefetchToken = await UserRefetchTokenModel.findOne({
      refresh_token,
      expires_at: { $gt: new Date() },
      is_revoked: false,
    }).populate("user_id");

    if (!userRefetchToken) {
      throw new httpError(401, "Refetch token không hợp lệ");
    }
    // return user để tạo access token mới
    return userRefetchToken?.user_id;
  }

  async revokeUserRefetchToken(refetch_token: string) {
    const result = await UserRefetchTokenModel.findOneAndUpdate(
      {
        refresh_token: refetch_token,
      },
      {
        is_revoked: true,
      }
    );

    if (!result) {
      throw new httpError(400, "Update token thất bại");
    }

    return result;
  }
}
