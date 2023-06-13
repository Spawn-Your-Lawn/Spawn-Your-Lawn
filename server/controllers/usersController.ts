import { Request, Response } from 'express';

import prisma from '../../prisma/client';

export const addUser = async (request: Request, response: Response) => {
  if (!request.body || !request.body.username || !request.body.password) {
    response.status(500).send('Not all information included');
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        username: request.body.username,
        password: request.body.password
      }
    });
    response.status(201).json(user);
  } catch (error) {
    console.error('Database error :', error);
    response.status(500).send('Database error');
  }
};
