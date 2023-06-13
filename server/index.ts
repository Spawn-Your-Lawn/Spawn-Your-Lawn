import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { auth, requiresAuth } from 'express-openid-connect';

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, '../dist')));

app.use(morgan('combined'));

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH_ID,
  issuerBaseURL: 'https://dev-lgwctxldh5a6hwd4.us.auth0.com',
  secret: process.env.AUTH_SECRET,
};

app.use(auth(config));

app.get('/', (req, res) => {
  res.send(
    req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
  );
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

const port = 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
