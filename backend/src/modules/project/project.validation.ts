import { body } from 'express-validator';

// Multipart form-data sends arrays/booleans as strings — sanitize them
const parseJsonArray = (value: any) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return value.split(',').map((s: string) => s.trim()).filter(Boolean); }
  }
  return value;
};

const parseBool = (value: any) => {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

const parseIntValue = (value: any) => {
  if (typeof value === 'number') return value;
  const n = parseInt(value, 10);
  return isNaN(n) ? value : n;
};

export const projectValidation = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('image').optional().isString(),
    body('tags').optional().customSanitizer(parseJsonArray),
    body('liveUrl').optional().isString(),
    body('results').optional().customSanitizer(parseJsonArray),
    body('isFeatured').optional().customSanitizer(parseBool),
    body('sortOrder').optional().customSanitizer(parseIntValue),
  ],

  update: [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('category').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('image').optional().isString(),
    body('tags').optional().customSanitizer(parseJsonArray),
    body('liveUrl').optional().isString(),
    body('results').optional().customSanitizer(parseJsonArray),
    body('isFeatured').optional().customSanitizer(parseBool),
    body('isActive').optional().customSanitizer(parseBool),
    body('sortOrder').optional().customSanitizer(parseIntValue),
  ],
};
