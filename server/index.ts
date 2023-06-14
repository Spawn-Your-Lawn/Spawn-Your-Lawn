import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { auth, requiresAuth } from 'express-openid-connect';
import morgan from 'morgan';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

app.use(morgan('combined'));

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH_ID,
  issuerBaseURL: process.env.DOMAIN,
  secret: process.env.AUTH_SECRET,
};

app.use(auth(config));

app.get('/', (request: Request, response: Response) => {
  response.send(
    request.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
  );
});

app.get('/profile', requiresAuth(), (request: Request, response: Response) => {
  response.send(JSON.stringify(request.oidc.user, null, 2));
});

const port = 3000;

app.post('/api/map/stores', async (request: Request, response: Response) => {
  const cleanedBodyData = request.body.data.replace(/\n\s+/g, '');
  await axios.get(
    `https://overpass-api.de/api/interpreter${cleanedBodyData}`
  )
    .then((result) => {
      response.status(200).send(result.data);
    })
    .catch(() => {
      response.status(500).send('error retrieving data on stores');
    });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
