import { Request, Response, NextFunction } from 'express';
const { validationResult } = require('express-validator');
import { AppError } from './errorHandler';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: { path?: string; msg: string }) => {
      if ('path' in error) {
        return `${error.path}: ${error.msg}`;
      }
      return error.msg;
    });

    return next(new AppError(formattedErrors.join('. '), 400));
  }
  next();
}; 