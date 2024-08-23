import { Router } from 'express';
import {
  IAppointmentRepository,
  prisma,
  PrismaAppointmentRepository,
} from '../infra';
import { AppointmentService } from '../services';
import { AppointmentController } from '../controllers';
import { validatorMiddleware } from '../shared';
import cors from 'cors';

const repository: IAppointmentRepository = new PrismaAppointmentRepository(
  prisma
);
const service = new AppointmentService(repository);
const controller = new AppointmentController(service);

const router = Router();

router
  .get('', (request, response) => {
    return controller.getAll(request, response);
  })
  .get('/:petID', (request, response) => {
    return controller.getAllByPetID(request, response);
  })
  .get('/:id', (request, response) => {
    return controller.getOneByID(request, response);
  })
  .post('/', validatorMiddleware('AppointmentModel'), (request, response) => {
    return controller.create(request, response);
  })
  .put('/', validatorMiddleware('AppointmentModel'), (request, response) => {
    return controller.update(request, response);
  })
  .put('/:id/status/:status', (request, response) => {
    return controller.updateStatus(request, response);
  })
  .delete('/:id', (request, response) => {
    return controller.delete(request, response);
  });

export default router;
