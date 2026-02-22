import { Router } from 'express';
import { reviewController } from './review.controller';
import { reviewValidation } from './review.validation';
import { authenticate, validate } from '../../middleware';

const router = Router();

router.get('/', reviewController.getAll);
router.get('/service/:serviceId', reviewController.getByService);
router.post('/', authenticate, validate(reviewValidation.create), reviewController.create);
router.put('/:id', authenticate, validate(reviewValidation.update), reviewController.update);
router.delete('/:id', authenticate, reviewController.delete);

export { router as reviewRoutes };
