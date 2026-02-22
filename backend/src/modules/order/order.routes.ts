import { Router } from 'express';
import { orderController } from './order.controller';
import { orderValidation } from './order.validation';
import { authenticate, authorize, validate } from '../../middleware';
import { ROLES } from '../../constants';

const router = Router();

router.get('/', authenticate, authorize(ROLES.ADMIN), orderController.getAll);
router.get('/my', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, orderController.getById);
router.post('/', authenticate, validate(orderValidation.create), orderController.create);
router.patch('/:id/status', authenticate, authorize(ROLES.ADMIN), validate(orderValidation.updateStatus), orderController.updateStatus);

export { router as orderRoutes };
