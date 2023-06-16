import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import { plantsRoutes } from './routes/plantsRoutes';

dotenv.config();

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../dist')));

app.use(morgan('combined'));

app.use('/api/plants', plantsRoutes);

const port = 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
