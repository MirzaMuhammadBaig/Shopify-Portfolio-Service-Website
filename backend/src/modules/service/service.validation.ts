import { body } from 'express-validator';

export const serviceValidation = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('shortDesc').trim().notEmpty().withMessage('Short description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('features').optional().isArray().withMessage('Features must be an array'),
    body('icon').optional().isString(),
    body('image').optional().isString(),
    body('isFeatured').optional().isBoolean(),
    body('deliveryDays').optional().isInt({ min: 1 }).withMessage('Delivery days must be at least 1'),
    body('sortOrder').optional().isInt({ min: 0 }),
  ],

  update: [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty(),
    body('shortDesc').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('features').optional().isArray(),
    body('icon').optional().isString(),
    body('image').optional().isString(),
    body('isFeatured').optional().isBoolean(),
    body('isActive').optional().isBoolean(),
    body('deliveryDays').optional().isInt({ min: 1 }).withMessage('Delivery days must be at least 1'),
    body('sortOrder').optional().isInt({ min: 0 }),
  ],
};
