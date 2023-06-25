import { Request, Response } from 'express';

import prisma from '../../prisma/client';

export const addPlant = async(request: Request, response: Response) => {
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

export const getPlantsByOrigin = async(request: Request, response: Response) => {
  const { origin } = request.params;

  try {
    const plants = await prisma.plant.findMany({
      where: {
        origin: {
          has: origin,
        },
      },
    });

    console.log('plants', plants);

    response.status(200).json(plants);
  } catch (error) {
    console.error('Database error :', error);
    response.status(500).send('Database error');
  }
};
