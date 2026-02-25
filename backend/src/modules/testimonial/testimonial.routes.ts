import { Router } from 'express';
import { testimonialController } from './testimonial.controller';
import { testimonialValidation } from './testimonial.validation';
import { authenticate, authorize, validate } from '../../middleware';
import { ROLES } from '../../constants';

const router = Router();

router.get('/', testimonialController.getAll);
router.post('/', authenticate, authorize(ROLES.ADMIN), validate(testimonialValidation.create), testimonialController.create);
router.put('/:id', authenticate, authorize(ROLES.ADMIN), validate(testimonialValidation.update), testimonialController.update);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), testimonialController.delete);

export { router as testimonialRoutes };
