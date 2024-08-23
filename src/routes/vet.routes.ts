import { Router } from 'express';
import { IVetRepository, prisma, PrismaVetRepository } from '../infra';
import { VetService } from '../services';
import { VetController } from '../controllers';
import { validatorMiddleware } from '../shared';

const repository: IVetRepository = new PrismaVetRepository(prisma);
const service = new VetService(repository);
const controller = new VetController(service);

const router = Router();

router
  .get('', (request, response) => {
    return controller.getAll(request, response);
  })
  .get('/:id', (request, response) => {
    return controller.getOneByID(request, response);
  })
  .post('/', validatorMiddleware('VetModel'), (request, response) => {
    return controller.create(request, response);
  })
  .put('/', validatorMiddleware('VetModel'), (request, response) => {
    return controller.update(request, response);
  })
  .delete('/:id', (request, response) => {
    return controller.delete(request, response);
  });

export default router;
