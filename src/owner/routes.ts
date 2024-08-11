import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  OwnerController,
  OwnerService,
  PrismaOwnerRepository,
} from './modules';

const prisma = new PrismaClient();
const repository = new PrismaOwnerRepository(prisma);
const service = new OwnerService(repository);
const controller = new OwnerController(service);

const router = Router();

router
  .get('', (request, response) => {
    return controller.getAll(request, response);
  })
  .get('/:id', (request, response) => {
    return controller.getOneByID(request, response);
  })
  .post('/', (request, response) => {
    return controller.create(request, response);
  })
  .put('/', (request, response) => {
    return controller.update(request, response);
  })
  .delete('/:id', (request, response) => {
    return controller.delete(request, response);
  });

export default router;
