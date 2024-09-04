import { Router } from 'express';
import { IVetRepository, prisma, PrismaVetRepository } from '../infra';
import { VetService } from '../services';
import { VetController } from '../controllers';
import {
  authenticateTokenMiddleware,
  checkPermission,
  validatorMiddleware,
} from '../shared';

const repository: IVetRepository = new PrismaVetRepository(prisma);
const service = new VetService(repository);
const controller = new VetController(service);

const router = Router();

router
  .get(
    '',
    authenticateTokenMiddleware,
    checkPermission(['view_vets, all_vet']),
    (request, response) => {
      return controller.getAll(request, response);
    }
  )
  .get(
    '/:id',
    authenticateTokenMiddleware,
    checkPermission(['view_vet, all_vet']),
    (request, response) => {
      return controller.getOneByID(request, response);
    }
  )
  .post(
    '/',
    authenticateTokenMiddleware,
    checkPermission(['create_vet, all_vet']),
    validatorMiddleware('VetModel'),
    (request, response) => {
      return controller.create(request, response);
    }
  )
  .put(
    '/',
    authenticateTokenMiddleware,
    checkPermission(['update_vet, all_vet']),
    validatorMiddleware('VetModel'),
    (request, response) => {
      return controller.update(request, response);
    }
  )
  .delete(
    '/:id',
    authenticateTokenMiddleware,
    checkPermission(['delete_vet, all_vet']),
    (request, response) => {
      return controller.delete(request, response);
    }
  );

export default router;
