import { Request, Response } from 'express';

import prisma from '../../prisma/client';

export const addPlant = async (request: Request, response: Response) => {
  if (!request.body || !request.body.plantId || !request.body.plantName || !request.body.origin) {
    response.status(500).send('Not all information included');
    return;
  }

  try {
    const plant = await prisma.plant.create({
      data: {
        plantId: request.body.id,
        plantName: request.body.common_name,
        origin: request.body.origin,
      },
    });

    response.status(201).json(plant);
  } catch (error) {
    console.error('Database error :', error);
    response.status(500).send('Database error');
  }
};
