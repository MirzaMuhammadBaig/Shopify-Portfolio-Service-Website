import { body } from 'express-validator';

export const paymentValidation = {
  createManual: [
    body('orderId').isUUID().withMessage('Valid order ID required'),
    body('method')
      .isIn(['PAYONEER'])
      .withMessage('Invalid payment method'),
    body('transactionId')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Transaction ID is required'),
  ],

  createSafepaySession: [
    body('orderId').isUUID().withMessage('Valid order ID required'),
  ],

  verify: [
    body('status')
      .isIn(['PAID', 'FAILED', 'REFUNDED'])
      .withMessage('Invalid payment status'),
  ],

  safepayConfirm: [
    body('tracker').isString().trim().notEmpty().withMessage('Tracker token is required'),
    body('sig').optional().isString().trim(),
    body('orderId').isUUID().withMessage('Valid order ID required'),
  ],
};
