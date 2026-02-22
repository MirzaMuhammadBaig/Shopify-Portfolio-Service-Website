import { body } from 'express-validator';

export const orderValidation = {
  create: [
    body('serviceId').optional().isUUID().withMessage('Valid service ID required'),
    body('customOfferId').optional().isUUID().withMessage('Valid custom offer ID required'),
    body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be positive'),
    body('requirements').optional().isString(),
  ],

  updateStatus: [
    body('status')
      .isIn(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELLED'])
      .withMessage('Invalid order status'),
    body('adminNotes').optional().isString(),
  ],
};
