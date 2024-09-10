import { UserUnauthorizedError } from '../../errors';
import { prisma, PrismaUserRepository } from '../../infra';
import { HttpError } from '../errors';
import { PermissionsGuard } from '../guard/permissions.guard';
import { Request, Response, NextFunction } from 'express';

export const checkPermission = (validPermissions: string[]) => {
  if (!validPermissions)
    throw new HttpError(
      'Permission Error: There are no permissions for this route',
      400
    );

  return async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const repository = new PrismaUserRepository(prisma);

    const authHeader = request.headers['authorization'];
    const token = authHeader;

    if (!token)
      throw new UserUnauthorizedError(
        'The user credentials are invalid. A token was not provided.',
        401
      );

    const user = await repository.getUserByToken(token);
    if (!user) {
      throw new UserUnauthorizedError(
        'The user credentials are invalid. A user was not found.',
        401
      );
    }

    const userRole = user ? user.role : 'ANONYMOUS';

    if (userRole == 'ADMIN') return next();

    const permissionsGuard = new PermissionsGuard();

    const userPermissions = permissionsGuard.getPermissionsByRoleName(userRole);

    let operations = validPermissions.map((valid) => {
      return valid.split('_')[0];
    });

    let alter = operations.find((operation) => {
      operation == 'create' || operation == 'update' || operation == 'delete';
    });

    let routes = validPermissions.map((valid) => {
      return valid.split('_')[1];
    });

    let pets = routes.find((route) => {
      route == 'pets' || route == 'pet';
    });

    const hasPermission = userPermissions.some((permission) => {
      validPermissions.includes(permission);
    });

    if (pets) return next();

    if (userRole != 'ANONYMOUS' && hasPermission) {
      if (alter) {
        const param = request.params.id;
        const bodyID = request.body.id;
        if (!param || !bodyID) {
          next(
            new UserUnauthorizedError(
              'The user credentials do not have authorized access. Missing substantial info for alter operation acess.',
              401
            )
          );
          if (param != user.id && bodyID != user.id) {
            next(
              new UserUnauthorizedError(
                'The user credentials do not have authorized access. The user does not have this level of access.',
                401
              )
            );
          }
        }
      }
      return next();
    } else {
      next(
        new UserUnauthorizedError(
          'The user credentials do not have authorized acess. The user does not have the permission.',
          401
        )
      );
    }
  };
};
