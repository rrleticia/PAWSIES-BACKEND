import { Router } from 'express';
import { IUserRepository, prisma, PrismaUserRepository } from '../infra';
import { AuthenticationService } from '../services';
import { AuthenticationController } from '../controllers';
import { validatorMiddleware } from '../shared';

const repository: IUserRepository = new PrismaUserRepository(prisma);
const service = new AuthenticationService(repository);
const controller = new AuthenticationController(service);

const router = Router();
router
  .post('/login', validatorMiddleware('LoginModel'), (request, response) => {
    return controller.login(request, response);
  })
  .post('/logout', validatorMiddleware('LoginModel'), (request, response) => {
    return controller.logout(request, response);
  });

export default router;
