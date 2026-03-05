import { Router } from 'express';
import { orderController } from './order.controller';
import { orderValidation } from './order.validation';
import { authenticate, authorize, validate, uploadDeliverables } from '../../middleware';
import { ROLES } from '../../constants';

const router = Router();

router.get('/', authenticate, authorize(ROLES.ADMIN), orderController.getAll);
router.get('/my', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, orderController.getById);
router.post('/', authenticate, validate(orderValidation.create), orderController.create);
router.patch('/:id/status', authenticate, authorize(ROLES.ADMIN), validate(orderValidation.updateStatus), orderController.updateStatus);

// Deliverables & approval flow
router.post('/:id/deliver', authenticate, authorize(ROLES.ADMIN), uploadDeliverables, orderController.submitDeliverables);
router.patch('/:id/approve', authenticate, orderController.approveOrder);
router.patch('/:id/revision', authenticate, orderController.requestRevision);

// Order messages
router.get('/:id/messages', authenticate, orderController.getMessages);
router.post('/:id/messages', authenticate, orderController.sendMessage);

export { router as orderRoutes };
