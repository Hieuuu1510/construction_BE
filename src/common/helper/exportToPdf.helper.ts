import ejs from "ejs";
import path, { resolve } from "path";
import puppeteer from "puppeteer";
import httpError from "./httpError.helper.js";
import { fileURLToPath } from "url";

let shareBrowser: puppeteer.Browser | null = null;

async function getBrowser() {
  // check nếu chưa có browser thi tạo 1 browser mới
  if (!shareBrowser) {
    shareBrowser = await puppeteer.launch({
      headless: true, // chạy Chromium ở chế độ không hiển thị (server)
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return shareBrowser;
}

export async function exportToPdf(data: any, filePath: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // Tạo đường dẫn tuyệt đối tới file template EJS.
  const templatePath = path.join(process.cwd(), "dist/views", filePath);

  if (!templatePath) {
    throw new httpError(404, "File template không tồn tại");
  }

  // render template ejs bằng biến data
  const html = await new Promise<string>((resolve, reject) => {
    ejs.renderFile(templatePath, { data }, (err, str) =>
      err ? reject(err) : resolve(str)
    );
  });

  // tạo browser
  const browser = await getBrowser();
  // tạo page trong browser
  const page = await browser.newPage();

  try {
    // gán HTML với page
    await page.setContent(html, { waitUntil: "networkidle2", timeout: 30000 });
    // xuất nội dung từ page sang file pdf
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // in cả background
      margin: {
        top: "20mm",
        bottom: "20mm",
      },
      preferCSSPageSize: true, // nếu template dùng @page {size: ...} ưu tiên CSS đó
    });

    console.log(pdfBuffer);

    return pdfBuffer;
  } catch (error) {
    throw new httpError(500, (error as Error).message);
  } finally {
    await page.close();
  }
}
