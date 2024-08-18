import 'express-async-errors';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors';

export const errorMiddleWare = (app: any) => {
  app.use(
    (
      error: HttpError,
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      response.status(error.status || 500).json({
        warn: 'Error',
        message: error.message,
        status: error.status,
      });
    }
  );
};
