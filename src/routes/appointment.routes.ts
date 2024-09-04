import { Router } from 'express';
import {
  IAppointmentRepository,
  prisma,
  PrismaAppointmentRepository,
} from '../infra';
import { AppointmentService } from '../services';
import { AppointmentController } from '../controllers';
import {
  authenticateTokenMiddleware,
  checkPermission,
  validatorMiddleware,
} from '../shared';

const repository: IAppointmentRepository = new PrismaAppointmentRepository(
  prisma
);
const service = new AppointmentService(repository);
const controller = new AppointmentController(service);

const router = Router();

router
  .get(
    '',
    authenticateTokenMiddleware,
    checkPermission(['view_appointments, all_appointment']),
    (request, response) => {
      return controller.getAll(request, response);
    }
  )
  .get(
    '/:petID',
    checkPermission(['view_appointment, all_appointment']),
    authenticateTokenMiddleware,
    (request, response) => {
      return controller.getAllByPetID(request, response);
    }
  )
  .get('/:id', (request, response) => {
    return controller.getOneByID(request, response);
  })
  .post(
    '/',
    authenticateTokenMiddleware,
    checkPermission(['create_appointment, all_appointment']),
    validatorMiddleware('AppointmentModel'),
    (request, response) => {
      return controller.create(request, response);
    }
  )
  .put(
    '/',
    authenticateTokenMiddleware,
    checkPermission(['update_appointment, all_appointment']),
    validatorMiddleware('AppointmentModel'),
    (request, response) => {
      return controller.update(request, response);
    }
  )
  .put(
    '/:id/status/:status',
    authenticateTokenMiddleware,
    checkPermission(['update_appointment, all_appointment']),
    (request, response) => {
      return controller.updateStatus(request, response);
    }
  )
  .delete(
    '/:id',
    authenticateTokenMiddleware,
    checkPermission(['delete_appointment, all_appointment']),
    (request, response) => {
      return controller.delete(request, response);
    }
  );

export default router;
