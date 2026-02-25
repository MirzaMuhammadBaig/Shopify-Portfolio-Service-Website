import { body } from 'express-validator';

export const faqValidation = {
  create: [
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('answer').trim().notEmpty().withMessage('Answer is required'),
    body('sortOrder').optional().isInt({ min: 0 }),
  ],

  update: [
    body('question').optional().trim().notEmpty().withMessage('Question cannot be empty'),
    body('answer').optional().trim().notEmpty().withMessage('Answer cannot be empty'),
    body('isActive').optional().isBoolean(),
    body('sortOrder').optional().isInt({ min: 0 }),
  ],
};
