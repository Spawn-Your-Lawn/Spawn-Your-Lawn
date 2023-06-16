import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

app.use(morgan('combined'));

const port = 3000;

app.post('/api/map/stores', (req, res) => {
  const cleanedBodyData = req.body.data.replace(/\n\s+/g, '');
  axios.get(
    `https://overpass-api.de/api/interpreter${cleanedBodyData}`
  )
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch(() => {
      res.status(500).send('error retrieving data on stores');
    });
});


app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
