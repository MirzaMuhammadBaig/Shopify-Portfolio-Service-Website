import { body } from 'express-validator';

export const aboutValidation = {
  createStat: [
    body('label').trim().notEmpty().withMessage('Label is required'),
    body('value').isInt({ min: 0 }).withMessage('Value must be a positive integer'),
    body('suffix').optional().trim(),
    body('sortOrder').optional().isInt(),
  ],

  updateStat: [
    body('label').optional().trim().notEmpty(),
    body('value').optional().isInt({ min: 0 }),
    body('suffix').optional().trim(),
    body('sortOrder').optional().isInt(),
  ],

  upsertStory: [
    body('title').optional().trim().notEmpty(),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('highlights').optional().isArray(),
  ],

  createExperience: [
    body('year').trim().notEmpty().withMessage('Year is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('sortOrder').optional().isInt(),
  ],

  updateExperience: [
    body('year').optional().trim().notEmpty(),
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('sortOrder').optional().isInt(),
  ],

  createMember: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('role').trim().notEmpty().withMessage('Role is required'),
    body('specialty').trim().notEmpty().withMessage('Specialty is required'),
    body('experience').trim().notEmpty().withMessage('Experience is required'),
    body('sortOrder').optional().isInt(),
  ],

  updateMember: [
    body('name').optional().trim().notEmpty(),
    body('role').optional().trim().notEmpty(),
    body('specialty').optional().trim().notEmpty(),
    body('experience').optional().trim().notEmpty(),
    body('sortOrder').optional().isInt(),
  ],

  createCertificate: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('issuer').trim().notEmpty().withMessage('Issuer is required'),
    body('year').trim().notEmpty().withMessage('Year is required'),
    body('description').optional().trim(),
    body('memberId').trim().notEmpty().withMessage('Team member is required'),
    body('sortOrder').optional().isInt(),
  ],

  updateCertificate: [
    body('title').optional().trim().notEmpty(),
    body('issuer').optional().trim().notEmpty(),
    body('year').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('memberId').optional().trim().notEmpty(),
    body('sortOrder').optional().isInt(),
  ],
};
