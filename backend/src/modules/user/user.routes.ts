import { Router } from 'express';
import { userController } from './user.controller';
import { userValidation } from './user.validation';
import { authenticate, authorize, validate } from '../../middleware';
import { ROLES } from '../../constants';

const router = Router();

router.get('/', authenticate, authorize(ROLES.ADMIN), userController.getAll);
router.get('/:id', authenticate, authorize(ROLES.ADMIN), userController.getById);
router.put('/profile', authenticate, validate(userValidation.updateProfile), userController.updateProfile);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), userController.delete);

export { router as userRoutes };
