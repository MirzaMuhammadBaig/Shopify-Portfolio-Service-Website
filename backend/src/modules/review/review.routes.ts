import { Router } from 'express';
import { reviewController } from './review.controller';
import { reviewValidation } from './review.validation';
import { authenticate, authorize, validate } from '../../middleware';
import { ROLES } from '../../constants';

const router = Router();

// Public
router.get('/', reviewController.getAll);
router.get('/service/:serviceId', reviewController.getByService);

// User
router.get('/my', authenticate, reviewController.getMyReviews);
router.post('/', authenticate, validate(reviewValidation.create), reviewController.create);
router.put('/:id', authenticate, validate(reviewValidation.update), reviewController.update);
router.delete('/:id', authenticate, reviewController.delete);

// Admin
router.get('/admin', authenticate, authorize(ROLES.ADMIN), reviewController.getAdminAll);
router.put('/admin/:id', authenticate, authorize(ROLES.ADMIN), validate(reviewValidation.update), reviewController.adminUpdate);
router.delete('/admin/:id', authenticate, authorize(ROLES.ADMIN), reviewController.adminDelete);
router.patch('/:id/visibility', authenticate, authorize(ROLES.ADMIN), reviewController.toggleVisibility);

export { router as reviewRoutes };
