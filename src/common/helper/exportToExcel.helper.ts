import xlsx from "xlsx";

interface IExportOptions<T> {
  data: T[];
  sheetName: string;
}

export function exportToExcel<T>({
  data,
  sheetName = "Sheet1",
}: IExportOptions<T>): Buffer {
  // tạo sheet
  const workSheet = xlsx.utils.json_to_sheet(data);

  // header
  const keys = Object.keys(data[0] || {});

  // lấy width lớn nhất của từng row rồi + 2
  const colWidths = keys.map((key) => {
    let maxLength = key.length;
    data?.map((row: T) => {
      const cellValue = (row as Record<string, any>)[key]
        ? (row as Record<string, any>)[key].toString().length
        : "";
      if (cellValue > maxLength) {
        maxLength = cellValue;
      }
    });
    return {
      wch: Number(maxLength) + 2,
    };
  });

  workSheet["!cols"] = colWidths;

  // tạo file
  const workBook = xlsx.utils.book_new();

  // ghi sheet vào file
  xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);

  // chuyển sang dạng nhị phân
  const buffer = xlsx.write(workBook, {
    type: "buffer",
  });

  return buffer;
}
