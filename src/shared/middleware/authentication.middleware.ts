import jwt from 'jsonwebtoken';
import { getToken } from '../util';
import { UserForbiddenError, UserUnauthorizedError } from '../../errors';
import { NextFunction, Request, Response } from 'express';

export const authenticateTokenMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers['authorization'];
  const token = authHeader as string;

  if (!token) {
    return next(
      new UserUnauthorizedError(
        'The user credentials are invalid. No token provided.',
        401
      )
    );
  }

  const SECRET_KEY = getToken();

  jwt.verify(token, SECRET_KEY, (error: any, user: any) => {
    if (error) {
      console.log(error);
      return next(
        new UserForbiddenError(
          'The user credentials are invalid. There was an error verifying the token.',
          403
        )
      );
    }

    // request.body.user = user;
    // delete request.body.user;

    next();
  });
};
