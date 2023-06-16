import express from 'express';

import { addPlant } from '../controllers/plantsController';

const router = express.Router();

router.post('/', addPlant);

export { router as plantsRoutes };
