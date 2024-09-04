import { Router } from 'express';
import { IPetRepository, prisma, PrismaPetRepository } from '../infra';
import { PetService } from '../services';
import { PetController } from '../controllers';
import {
  authenticateTokenMiddleware,
  checkPermission,
  validatorMiddleware,
} from '../shared';

const repository: IPetRepository = new PrismaPetRepository(prisma);
const service = new PetService(repository);
const controller = new PetController(service);

const router = Router();

router
  .get(
    '',
    authenticateTokenMiddleware,
    checkPermission(['view_pets, all_pet']),
    (request, response) => {
      return controller.getAll(request, response);
    }
  )
  .get(
    '/:ownerID',
    authenticateTokenMiddleware,
    checkPermission(['view_pet, all_pet']),
    (request, response) => {
      return controller.getOneByID(request, response);
    }
  )
  .get(
    '/:id',
    authenticateTokenMiddleware,
    checkPermission(['view_pet, all_pet']),
    (request, response) => {
      return controller.getOneByID(request, response);
    }
  )
  .post(
    '/',
    authenticateTokenMiddleware,
    checkPermission(['create_pet, all_pet']),
    validatorMiddleware('PetModel'),
    (request, response) => {
      return controller.create(request, response);
    }
  )
  .put(
    '/',
    authenticateTokenMiddleware,
    checkPermission(['update_pet, all_pet']),
    validatorMiddleware('PetModel'),
    (request, response) => {
      return controller.update(request, response);
    }
  )
  .delete(
    '/:id',
    authenticateTokenMiddleware,
    checkPermission(['delete_pet, all_pet']),
    (request, response) => {
      return controller.delete(request, response);
    }
  );

export default router;
