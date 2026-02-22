import { body } from 'express-validator';

export const userValidation = {
  updateProfile: [
    body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
    body('phone').optional().isMobilePhone('any').withMessage('Valid phone number required'),
    body('avatar').optional().isURL().withMessage('Valid URL required for avatar'),
  ],
};
