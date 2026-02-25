import { body } from 'express-validator';

export const testimonialValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('role').optional().trim().isString(),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
    body('sortOrder').optional().isInt({ min: 0 }),
  ],

  update: [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('role').optional().trim().isString(),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('comment').optional().trim().notEmpty(),
    body('isActive').optional().isBoolean(),
    body('sortOrder').optional().isInt({ min: 0 }),
  ],
};
