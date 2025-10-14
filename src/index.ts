import dotenv from "dotenv";
import { connect } from "./config/db/index.js";
import express from "express";
import router from "./routers/index.js";
import cors from "cors";
import { errorGlobal } from "./middleware/errorGlobal.js";
import { middlewareTokenAuth } from "./middleware/auth.js";

dotenv.config();

const app = express();
connect();

app.use(
  cors({
    origin: ["http://localhost:3000"], // origin: xác định những domain nào được phép gọi API
    methods: ["GET", "POST", "PUT", "DELETE"], // methods: chỉ định các HTTP method được phép sử dụng từ client
    allowedHeaders: ["Content-Type", "Authorization"], // allowedHeaders: chỉ định header nào client được phép gửi lên
    exposedHeaders: ["X-Total-Count"], // exposedHeaders: các header mà server cho phép client đọc được từ response
    credentials: true, // credentials: cho phép gửi cookie hoặc thông tin xác thực qua CORS
    maxAge: 600, // maxAge: thời gian (tính bằng giây) mà trình duyệt cache kết quả preflight
    optionsSuccessStatus: 200, // optionsSuccessStatus: mã HTTP trả về cho preflight OPTIONS thành công
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

app.use(middlewareTokenAuth);
app.use("/api", router);

// global error handler
app.use(errorGlobal);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
