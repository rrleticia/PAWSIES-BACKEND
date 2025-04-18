import { Router } from 'express';
import {
  IUserRepository,
  IVetRepository,
  prisma,
  PrismaUserRepository,
  PrismaVetRepository,
} from '../infra';
import { VetService } from '../services';
import { VetController } from '../controllers';
import { authenticateTokenMiddleware, validatorMiddleware } from '../shared';

const userRepository: IUserRepository = new PrismaUserRepository(prisma);
const repository: IVetRepository = new PrismaVetRepository(prisma);
const service = new VetService(repository, userRepository);
const controller = new VetController(service);

const router = Router();

router
  .get('', authenticateTokenMiddleware, (request, response) => {
    return controller.getAll(request, response);
  })
  .get('/:id', authenticateTokenMiddleware, (request, response) => {
    return controller.getOneByID(request, response);
  })
  .post('/', validatorMiddleware('VetModel'), (request, response) => {
    return controller.create(request, response);
  })
  .put(
    '/',
    validatorMiddleware('VetModel'),
    authenticateTokenMiddleware,
    (request, response) => {
      return controller.update(request, response);
    }
  )
  .delete('/:id', authenticateTokenMiddleware, (request, response) => {
    return controller.delete(request, response);
  });

export default router;
