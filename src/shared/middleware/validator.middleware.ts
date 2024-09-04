import 'express-async-errors';
import { Request, Response, NextFunction } from 'express';
import Joi, { ValidationError } from 'joi';
import { Validators } from '../../models';
import { HttpError } from '../errors';
import { validator } from '../interfaces';

export const validatorMiddleware = (validator: validator) => {
  if (!Validators.hasOwnProperty(validator))
    throw new HttpError(
      `Validation Error: '${validator}' validator is not exist`,
      502
    );

  return async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const value = await Validators[validator].validateAsync(request.body, {
        warnings: true,
      });
      request.body = value;

      next();
    } catch (error: any) {
      error = error as ValidationError;
      const model = validator.replace('Model', '');
      next(
        new HttpError(
          `Invalid input for a field of ${model}. Joi raises: ${error.details.map(
            (detail: any) => {
              return detail.message.replaceAll('"', '');
            }
          )}`,
          405
        )
      );
    }
  };
};
