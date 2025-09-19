import { Router, type Application, type Request, type Response } from "express";

import galleryRouter from '../modules/gallery/gallery.route.js';


// const router = (app: Application) => {
//   app.get('/galleries', (req: Request, res: Response) => {
//     res.send('Hello World!');
//   })
// }

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

router.use('/gallery', galleryRouter);



export default router;