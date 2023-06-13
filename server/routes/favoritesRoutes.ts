import express from 'express';

import { getPlantsFromFavorite, addPlantToFavorite, removePlantFromFavorite } from '../controllers/favoritesController';

const router = express.Router();

router.get('/', getPlantsFromFavorite);
router.post('/', addPlantToFavorite);
router.delete('/:plantId', removePlantFromFavorite);

export { router as favoritesRoutes };
