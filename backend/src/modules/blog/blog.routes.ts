import { Router } from 'express';
import { blogController } from './blog.controller';
import { blogValidation } from './blog.validation';
import { authenticate, authorize, validate } from '../../middleware';
import { ROLES } from '../../constants';

const router = Router();

router.get('/', blogController.getAll);
router.get('/:slug', blogController.getBySlug);
router.post('/', authenticate, authorize(ROLES.ADMIN), validate(blogValidation.create), blogController.create);
router.put('/:id', authenticate, authorize(ROLES.ADMIN), validate(blogValidation.update), blogController.update);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), blogController.delete);

export { router as blogRoutes };
