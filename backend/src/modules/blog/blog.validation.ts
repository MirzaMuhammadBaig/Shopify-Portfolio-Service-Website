import { body } from 'express-validator';

export const blogValidation = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('excerpt').optional().trim().isLength({ max: 500 }),
    body('coverImage').optional().isString(),
    body('metaTitle').optional().trim().isLength({ max: 70 }),
    body('metaDesc').optional().trim().isLength({ max: 160 }),
    body('tags').optional().isArray(),
    body('isPublished').optional().isBoolean(),
    body('publishedAt').optional().isISO8601().withMessage('publishedAt must be a valid date'),
  ],

  update: [
    body('title').optional().trim().notEmpty(),
    body('content').optional().trim().notEmpty(),
    body('excerpt').optional().trim().isLength({ max: 500 }),
    body('coverImage').optional().isString(),
    body('metaTitle').optional().trim().isLength({ max: 70 }),
    body('metaDesc').optional().trim().isLength({ max: 160 }),
    body('tags').optional().isArray(),
    body('isPublished').optional().isBoolean(),
    body('publishedAt').optional().isISO8601().withMessage('publishedAt must be a valid date'),
  ],
};
