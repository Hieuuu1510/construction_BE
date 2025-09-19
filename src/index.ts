

import dotenv from 'dotenv';
import { connect } from './config/db/index.js';
import express from 'express';
import router from './routers/index.js';
import cors from 'cors';

dotenv.config();

const app = express();
connect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
