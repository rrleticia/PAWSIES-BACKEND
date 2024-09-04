import { Router } from 'express';
import { IUserRepository, prisma, PrismaUserRepository } from '../infra';
import { UserService } from '../services';
import { UserController } from '../controllers';
import { checkPermission, validatorMiddleware } from '../shared';

const repository: IUserRepository = new PrismaUserRepository(prisma);
const service = new UserService(repository);
const controller = new UserController(service);

const router = Router();

router
  .get('', checkPermission(['view_users, all_users']), (request, response) => {
    return controller.getAll(request, response);
  })
  .get(
    '/:id',
    checkPermission(['view_user, all_users']),
    (request, response) => {
      return controller.getOneByID(request, response);
    }
  )
  .post('/', validatorMiddleware('UserModel'), (request, response) => {
    return controller.create(request, response);
  })
  .put('/', validatorMiddleware('UserModel'), (request, response) => {
    return controller.update(request, response);
  })
  .delete(
    '/:id',
    checkPermission(['delete_user, all_users']),
    (request, response) => {
      return controller.delete(request, response);
    }
  );

export default router;
