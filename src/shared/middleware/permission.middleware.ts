import { UserUnauthorizedError } from '../../errors';
import { HttpError } from '../errors';
import { PermissionsGuard } from '../guard/permissions.guard';
import { Request, Response, NextFunction } from 'express';

export const checkPermission = (validPermissions: string[]) => {
  if (!validPermissions)
    throw new HttpError(
      'Permission Error: There are no permissions for this route',
      400
    );

  return function (request: Request, response: Response, next: NextFunction) {
    if (!request.body) {
      throw new UserUnauthorizedError('The user credentials are invalid.', 401);
    }
    const user = request.body.user;

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

    const hasPermission = userPermissions.some((permission) => {
      validPermissions.includes(permission);
    });

    if (userRole != 'ANONYMOUS' && hasPermission) {
      if (alter) {
        const param = request.params.id;
        const bodyID = request.body.id;
        if (!param && !bodyID) {
          next(
            new UserUnauthorizedError(
              'The user credentials do not have authorized acess.',
              401
            )
          );
          if (param != user.id && bodyID != user.id) {
            next(
              new UserUnauthorizedError(
                'The user credentials do not have authorized acess.',
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
          'The user credentials do not have authorized acess.',
          401
        )
      );
    }
  };
};
