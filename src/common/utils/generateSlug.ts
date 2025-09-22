import type mongoose from "mongoose";

export const slugify = (str: string) => {
  return str
    .toString()
    .normalize("NFD") // Chuyển đổi chuỗi sang dạng bình thường, loại bỏ các dấu điều âm
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các ký tự dấu điều âm
    .toLowerCase() // Chuyển đổi chuỗi sang chữ thường
    .trim() // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
    .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ các ký tự không phải là chữ cái, số, dấu cách hoặc dấu gạch ngang
    .replace(/\s+/g, "-") // Thay thế các khoảng trắng liên tiếp bằng dấu gạch ngang
    .replace(/-+/g, "-"); // Thay thế các dấu gạch ngang liên tiếp bằng một dấu gạch ngang duy nhất
};

export const generateSlug = async (
  name: string,
  id: mongoose.Types.ObjectId,
  Model: any
) => {
  let slug = slugify(name);

  // kiểm tra slug đã tồn tại chưa
  const existing = await Model.findOne({
    slug,
    _id: { $ne: id }, // $ne lấy tất cả các _id khác trừ _id hiện tại
  });

  if (existing) {
    let counter = 1;
    while (true) {
      const newSlug = `${slug}-${counter}`;
      const exists = await Model.findOne({
        slug: newSlug,
      });
      if (!exists) {
        slug = newSlug;
        break;
      }
      counter++;
    }
  }

  return slug;
};
