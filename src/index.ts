import dotenv from "dotenv";
import { connect } from "./config/db/index.js";
import express from "express";
import router from "./routers/index.js";
import cors from "cors";
import * as middleware from "./middleware/index.js";

dotenv.config();

const app = express();
connect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

// parse query params
// app.use(middleware.queryBooleanParser);

app.use("/api", router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
