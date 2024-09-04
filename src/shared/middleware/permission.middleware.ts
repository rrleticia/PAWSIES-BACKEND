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

    const hasPermission = userPermissions.some((permission) =>
      validPermissions.includes(permission)
    );

    // lógica de usuário alterar apenas o seu!

    if (userRole != 'ANONYMOUS' && hasPermission) {
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
