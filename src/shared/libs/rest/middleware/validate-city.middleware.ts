import { Middleware } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { CitiesName } from '../../../types/index.js';

export class ValidateCityMiddleware implements Middleware {
  constructor(private param: string) {}

  execute({ params }: Request, _res: Response, next: NextFunction) {
    const city = params[ this.param ];
    const currentCity = city as CitiesName;
    if (Object.values(CitiesName).includes(currentCity)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `City with name '${ city }' is not exist`,
      'ValidateCityMiddleware'
    );
  }
}
