import { body } from 'express-validator';

export const chatValidation = {
  createConversation: [
    body('subject').optional().trim().isLength({ max: 200 }).withMessage('Subject max 200 chars'),
  ],

  updateSubject: [
    body('subject').trim().notEmpty().withMessage('Subject is required')
      .isLength({ max: 200 }).withMessage('Subject max 200 chars'),
  ],

  sendMessage: [
    body('content').trim().notEmpty().withMessage('Message content is required')
      .isLength({ max: 5000 }).withMessage('Message max 5000 chars'),
  ],
};
