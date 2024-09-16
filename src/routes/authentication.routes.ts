import { Router } from 'express';
import { IUserRepository, prisma, PrismaUserRepository } from '../infra';
import { AuthenticationService } from '../services';
import { AuthenticationController } from '../controllers';

const repository: IUserRepository = new PrismaUserRepository(prisma);
const service = new AuthenticationService(repository);
const controller = new AuthenticationController(service);

const router = Router();
router
  .post('/login', (request, response) => {
    return controller.login(request, response);
  })
  .post('/logout', (request, response) => {
    return controller.logout(request, response);
  });

export default router;
