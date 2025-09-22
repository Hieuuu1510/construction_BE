import cloudinary from "../../config/cloudinary/index.js";
import fs from "fs";

export class UploadService {
  async uploadSingle(file: Express.Multer.File) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "image",
    });

    console.log(result);

    fs.unlinkSync(file.path);

    return {
      url: result.secure_url,
      // public_id: result.public_id,
    };
  }

  async uploadMultiple(files: Express.Multer.File[]) {
    let results = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "image",
      });

      fs.unlinkSync(file.path);

      results.push({
        url: result.secure_url,
        // public_id: result.public_id,
      });
    }

    return results;
  }
}
