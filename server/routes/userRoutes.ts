import express from 'express';

import { addUser } from '../controllers/usersController';

const router = express.Router();

router.post('/', addUser);

export { router as userRoutes };
