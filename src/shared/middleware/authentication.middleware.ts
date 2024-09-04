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
  const token = authHeader;

  if (!token) {
    throw new UserUnauthorizedError('The user credentials are invalid.', 401);
  }

  const SECRET_KEY = getToken();

  jwt.verify(token, SECRET_KEY, (error: any, user: any) => {
    if (error) {
      next(new UserForbiddenError('The user credentials are invalid.', 403));
    }
    request.body.user = user;
    next();
  });
};
