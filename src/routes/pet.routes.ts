import { Router } from 'express';
import { IPetRepository, prisma, PrismaPetRepository } from '../infra';
import { PetService } from '../services';
import { PetController } from '../controllers';
import { authenticateTokenMiddleware } from '../shared';

const repository: IPetRepository = new PrismaPetRepository(prisma);
const service = new PetService(repository);
const controller = new PetController(service);

const router = Router();

router
  .get('', authenticateTokenMiddleware, (request, response) => {
    return controller.getAll(request, response);
  })
  .get('/:ownerID', authenticateTokenMiddleware, (request, response) => {
    return controller.getOneByID(request, response);
  })
  .get('/:id', authenticateTokenMiddleware, (request, response) => {
    return controller.getOneByID(request, response);
  })
  .post('/', authenticateTokenMiddleware, (request, response) => {
    return controller.create(request, response);
  })
  .put('/', authenticateTokenMiddleware, (request, response) => {
    return controller.update(request, response);
  })
  .delete('/:id', authenticateTokenMiddleware, (request, response) => {
    return controller.delete(request, response);
  });

export default router;
