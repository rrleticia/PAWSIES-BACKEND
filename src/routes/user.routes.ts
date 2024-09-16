import { Router } from 'express';
import { IUserRepository, prisma, PrismaUserRepository } from '../infra';
import { UserService } from '../services';
import { UserController } from '../controllers';

const repository: IUserRepository = new PrismaUserRepository(prisma);
const service = new UserService(repository);
const controller = new UserController(service);

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
