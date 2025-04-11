import { Router } from 'express';
import {
  IOwnerRepository,
  IPetRepository,
  prisma,
  PrismaOwnerRepository,
  PrismaPetRepository,
} from '../infra';
import { PetService } from '../services';
import { PetController } from '../controllers';
import { authenticateTokenMiddleware, validatorMiddleware } from '../shared';

const repository: IPetRepository = new PrismaPetRepository(prisma);
const ownerRepository: IOwnerRepository = new PrismaOwnerRepository(prisma);
const service = new PetService(repository, ownerRepository);
const controller = new PetController(service);

const router = Router();

router
  .get('', authenticateTokenMiddleware, (request, response) => {
    return controller.getAll(request, response);
  })
  .get('/owner/:username', authenticateTokenMiddleware, (request, response) => {
    return controller.getAllByOwnerUsername(request, response);
  })
  .get('/:id', authenticateTokenMiddleware, (request, response) => {
    return controller.getOneByID(request, response);
  })
  .post(
    '/',
    validatorMiddleware('PetModel'),
    authenticateTokenMiddleware,
    (request, response) => {
      return controller.create(request, response);
    }
  )
  .put(
    '/',
    validatorMiddleware('PetModel'),
    authenticateTokenMiddleware,
    (request, response) => {
      return controller.update(request, response);
    }
  )
  .delete('/:id', authenticateTokenMiddleware, (request, response) => {
    return controller.delete(request, response);
  });

export default router;
