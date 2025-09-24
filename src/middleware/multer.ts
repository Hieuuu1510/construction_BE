import multer from "multer";
import path from "path";
import { typeUpload } from "../common/enums/upload.enum.js";

export const upload = multer({
  dest: "src/uploads/files/",
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// check file type trước khi upload
function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const isVideo = file?.mimetype.startsWith(typeUpload.VIDEO);
  // check file type
  const regexFiletypes = isVideo
    ? /mp4|avi|mov|mkv|wmv|flv|webm/
    : /jpeg|jpg|png|gif/;

  // lấy định dạng file
  const extname = regexFiletypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = regexFiletypes.test(file.mimetype);

  if (mimetype && extname) {
    // error & success
    return cb(null, true);
  } else {
    isVideo
      ? cb(new Error("Error: Video only! (mp4, avi, mov, mkv, wmv, flv, webm)"))
      : cb(new Error("Error: Images only! (jpeg, jpg, png, gif)"));
  }
}
