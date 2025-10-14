import { typeUpload } from "../../common/enums/upload.enum.js";
import cloudinary from "../../config/cloudinary/index.js";
import fs from "fs";

class UploadService {
  async uploadSingle(file: Express.Multer.File, resource_type: typeUpload) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "files",
      resource_type: resource_type,
    });

    // tạo thumbnail
    // let thumbnailUrl: string | undefined;

    // if (resource_type === typeUpload.VIDEO) {
    //   thumbnailUrl = cloudinary.url(result.public_id, {
    //     resource_type: typeUpload.VIDEO,
    //     format: "jpg",
    //     transformation: [
    //       { start_offset: "2" }, // lấy frame tại giây thứ 2
    //       { crop: "fill" }, // resize thumbnail
    //     ],
    //   });
    // }

    console.log(result);
    // xoá file
    fs.unlinkSync(file.path);

    return {
      url: result.secure_url,
      // thumbnailUrl,
      // resource_type: result.resource_type,
      // public_id: result.public_id,
    };
  }

  async uploadMultiple(files: Express.Multer.File[]) {
    const uploadPromises = files.map(async (file) => {
      try {
        const isVideo = file.mimetype.startsWith(typeUpload.VIDEO);
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "files",
          resource_type: isVideo ? typeUpload.VIDEO : typeUpload.IMAGE,
        });

        // tạo thumbnail
        // let thumbnailUrl: string | undefined;

        // if (isVideo) {
        //   thumbnailUrl = cloudinary.url(result.public_id, {
        //     resource_type: typeUpload.VIDEO,
        //     format: "jpg",
        //     transformation: [
        //       { start_offset: "2" }, // lấy frame tại giây thứ 2
        //       { crop: "fill" }, // resize thumbnail
        //     ],
        //   });
        // }

        // xoá file
        fs.unlinkSync(file.path);

        return {
          url: result.secure_url,
          // thumbnailUrl,
          // resource_type: result.resource_type,
          // public_id: result.public_id,
        };
      } catch (error) {
        console.error(`Upload failed for file: ${file.path}`, error);
      }
    });

    const results = await Promise.all(uploadPromises);

    console.log(results);

    return results;
  }
}

export default new UploadService();
