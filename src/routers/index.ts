import { Router, type Application, type Request, type Response } from "express";

import galleryRouter from "../modules/gallery/gallery.route.js";
import productRouter from "../modules/product/product.route.js";
import productCategoryRouter from "../modules/productCategory/productCategory.route.js";
import uploadRouter from "../modules/upload/upload.route.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

router.use("/gallery", galleryRouter);
router.use("/product", productRouter);
router.use("/productCategory", productCategoryRouter);
router.use("/upload", uploadRouter);

export default router;
