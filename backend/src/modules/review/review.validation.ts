import { body } from 'express-validator';

export const reviewValidation = {
  create: [
    body('serviceId').isUUID().withMessage('Valid service ID required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    body('comment').optional().trim().isLength({ max: 1000 }).withMessage('Comment max 1000 chars'),
  ],

  update: [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    body('comment').optional().trim().isLength({ max: 1000 }),
  ],
};
