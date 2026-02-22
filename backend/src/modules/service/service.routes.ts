import { Router } from 'express';
import { serviceController } from './service.controller';
import { serviceValidation } from './service.validation';
import { authenticate, authorize, validate } from '../../middleware';
import { ROLES } from '../../constants';

const router = Router();

router.get('/', serviceController.getAll);
router.get('/featured', serviceController.getFeatured);
router.get('/:slug', serviceController.getBySlug);
router.post('/', authenticate, authorize(ROLES.ADMIN), validate(serviceValidation.create), serviceController.create);
router.put('/:id', authenticate, authorize(ROLES.ADMIN), validate(serviceValidation.update), serviceController.update);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), serviceController.delete);

export { router as serviceRoutes };
