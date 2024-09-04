import { Router } from 'express';
import {
  IOwnerRepository,
  IUserRepository,
  prisma,
  PrismaOwnerRepository,
  PrismaUserRepository,
} from '../infra';
import { OwnerService } from '../services';
import { OwnerController } from '../controllers';
import {
  authenticateTokenMiddleware,
  checkPermission,
  validatorMiddleware,
} from '../shared';

const userRepository: IUserRepository = new PrismaUserRepository(prisma);
const repository: IOwnerRepository = new PrismaOwnerRepository(prisma);
const service = new OwnerService(repository, userRepository);
const controller = new OwnerController(service);

const router = Router();

router
  .get(
    '',
    authenticateTokenMiddleware,
    checkPermission(['view_owners, all_owner']),
    (request, response) => {
      return controller.getAll(request, response);
    }
  )
  .get(
    '/:id',
    authenticateTokenMiddleware,
    checkPermission(['view_owner, all_owner']),
    (request, response) => {
      return controller.getOneByID(request, response);
    }
  )
  .post(
    '/',
    validatorMiddleware('OwnerModel'),
    authenticateTokenMiddleware,
    // checkPermission(['create_owner, all_owner']),
    (request, response) => {
      return controller.create(request, response);
    }
  )
  .put(
    '/',
    validatorMiddleware('OwnerModel'),
    authenticateTokenMiddleware,
    checkPermission(['update_owner, all_owner']),
    (request, response) => {
      return controller.update(request, response);
    }
  )
  .delete(
    '/:id',
    authenticateTokenMiddleware,
    checkPermission(['delete_owner, all_owner']),
    (request, response) => {
      return controller.delete(request, response);
    }
  );

export default router;
