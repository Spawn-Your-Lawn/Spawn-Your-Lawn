import express from 'express';

import { addPlant, getPlantsByOrigin } from '../controllers/plantsController';

const router = express.Router();

router.post('/', addPlant);
router.get('/:origin', getPlantsByOrigin);

export { router as plantsRoutes };
