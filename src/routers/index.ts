import { Router, type Request, type Response } from "express";

import galleryRouter from "../modules/gallery/gallery.route.js";
import productRouter from "../modules/product/product.route.js";
import productCategoryRouter from "../modules/productCategory/productCategory.route.js";
import uploadRouter from "../modules/upload/upload.route.js";
import newsRouter from "../modules/news/news.route.js";
import newsCategoryRouter from "../modules/newsCategory/newsCategory.route.js";
import constructionCategoryRouter from "../modules/constructionCategory/constructionCategory.route.js";
import constructionRouter from "../modules/construction/construction.route.js";
import featuredProjectsRouter from "../modules/featuredProjects/featuredProjects.route.js";
import contactRouter from "../modules/contact/contact.route.js";
import authRouter from "../modules/auth/auth.route.js";
import userRouter from "../modules/users/user.route.js";
import mailRouter from "../modules/mail/mail.route.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

router.use("/gallery", galleryRouter);
router.use("/product", productRouter);
router.use("/product-category", productCategoryRouter);
router.use("/upload", uploadRouter);
router.use("/news-category", newsCategoryRouter);
router.use("/news", newsRouter);
router.use("/construction-category", constructionCategoryRouter);
router.use("/construction", constructionRouter);
router.use("/featured-projects", featuredProjectsRouter);
router.use("/contact", contactRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/mail", mailRouter);

export default router;
