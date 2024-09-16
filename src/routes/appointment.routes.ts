import { Router } from 'express';
import {
  IAppointmentRepository,
  prisma,
  PrismaAppointmentRepository,
} from '../infra';
import { AppointmentService } from '../services';
import { AppointmentController } from '../controllers';
import { authenticateTokenMiddleware } from '../shared';

const repository: IAppointmentRepository = new PrismaAppointmentRepository(
  prisma
);
const service = new AppointmentService(repository);
const controller = new AppointmentController(service);

const router = Router();

router
  .get('', authenticateTokenMiddleware, (request, response) => {
    return controller.getAll(request, response);
  })
  .get('/:petID', authenticateTokenMiddleware, (request, response) => {
    return controller.getAllByPetID(request, response);
  })
  .get('/:id', (request, response) => {
    return controller.getOneByID(request, response);
  })
  .post('/', authenticateTokenMiddleware, (request, response) => {
    return controller.create(request, response);
  })
  .put('/', authenticateTokenMiddleware, (request, response) => {
    return controller.update(request, response);
  })
  .put(
    '/:id/status/:status',
    authenticateTokenMiddleware,
    (request, response) => {
      return controller.updateStatus(request, response);
    }
  )
  .delete('/:id', authenticateTokenMiddleware, (request, response) => {
    return controller.delete(request, response);
  });

export default router;
