import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { HTTP_STATUS, GENERAL_MESSAGES } from '../constants';
import { ApiError } from '../utils/api-error';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, GENERAL_MESSAGES.NOT_FOUND));
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
    return;
  }

  console.error('Unhandled error:', err);

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: GENERAL_MESSAGES.SERVER_ERROR,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};
