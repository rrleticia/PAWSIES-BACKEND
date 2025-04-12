import 'express-async-errors';
import { Request, Response, NextFunction } from 'express';

export const loggerMiddleWare = (app: any) => {
  app.use((request: any, response: Response, next: NextFunction) => {
    const time = new Date(Date.now()).toString();
    console.log(time, request.method, request.path, request.body);
    next();
  });
};
