import { Router } from 'express';
import { paymentController } from './payment.controller';
import { paymentValidation } from './payment.validation';
import { authenticate, authorize, validate, uploadImage } from '../../middleware';
import { ROLES } from '../../constants';

const router = Router();

router.get('/methods', paymentController.getMethods);
router.post('/manual', authenticate, uploadImage, validate(paymentValidation.createManual), paymentController.createManualPayment);
router.post('/stripe-session', authenticate, validate(paymentValidation.createStripeSession), paymentController.createStripeSession);
router.get('/order/:orderId', authenticate, paymentController.getByOrderId);
router.get('/', authenticate, authorize(ROLES.ADMIN), paymentController.getAll);
router.patch('/:id/verify', authenticate, authorize(ROLES.ADMIN), validate(paymentValidation.verify), paymentController.verify);

export { router as paymentRoutes };
