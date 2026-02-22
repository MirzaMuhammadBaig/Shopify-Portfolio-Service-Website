import { Router } from 'express';
import { adminController } from './admin.controller';
import { authenticate, authorize } from '../../middleware';
import { ROLES } from '../../constants';

const router = Router();

router.use(authenticate, authorize(ROLES.ADMIN));
router.get('/dashboard', adminController.getDashboardStats);

export { router as adminRoutes };
