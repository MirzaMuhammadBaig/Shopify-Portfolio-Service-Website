import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { HTTP_STATUS, GENERAL_MESSAGES } from '../constants';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }

    const extractedErrors = errors.array().map((err) => ({
      field: (err as any).path || 'unknown',
      message: err.msg,
    }));

    res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: GENERAL_MESSAGES.VALIDATION_ERROR,
      errors: extractedErrors,
    });
  };
};
