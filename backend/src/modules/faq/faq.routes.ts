import { Router } from 'express';
import { faqController } from './faq.controller';
import { faqValidation } from './faq.validation';
import { authenticate, authorize, validate } from '../../middleware';
import { ROLES } from '../../constants';

const router = Router();

router.get('/', faqController.getAll);
router.post('/', authenticate, authorize(ROLES.ADMIN), validate(faqValidation.create), faqController.create);
router.put('/:id', authenticate, authorize(ROLES.ADMIN), validate(faqValidation.update), faqController.update);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), faqController.delete);

export { router as faqRoutes };
