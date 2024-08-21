import { Router } from 'express';
import { IOwnerRepository, prisma, PrismaOwnerRepository } from '../infra';
import { OwnerService } from '../services';
import { OwnerController } from '../controllers';
import { validatorMiddleware } from '../shared';

const repository: IOwnerRepository = new PrismaOwnerRepository(prisma);
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
  .post('/', validatorMiddleware('OwnerModel'), (request, response) => {
    return controller.create(request, response);
  })
  .put('/', (request, response) => {
    return controller.update(request, response);
  })
  .delete('/:id', (request, response) => {
    return controller.delete(request, response);
  });

export default router;
