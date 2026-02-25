import { Router } from 'express';
import { projectController } from './project.controller';
import { projectValidation } from './project.validation';
import { authenticate, authorize, validate, uploadImage } from '../../middleware';
import { ROLES } from '../../constants';

const router = Router();

router.get('/', projectController.getAll);
router.get('/featured', projectController.getFeatured);
router.get('/:slug', projectController.getBySlug);
router.post('/', authenticate, authorize(ROLES.ADMIN), uploadImage, validate(projectValidation.create), projectController.create);
router.put('/:id', authenticate, authorize(ROLES.ADMIN), uploadImage, validate(projectValidation.update), projectController.update);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), projectController.delete);

export { router as projectRoutes };
