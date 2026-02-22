import { Router } from 'express';
import { whatsappController } from './whatsapp.controller';
import { authenticate, authorize } from '../../middleware';
import { ROLES } from '../../constants';

const router = Router();

router.get('/webhook', whatsappController.verifyWebhook);
router.post('/webhook', whatsappController.handleWebhook);
router.post('/send', authenticate, authorize(ROLES.ADMIN), whatsappController.sendMessage);

export { router as whatsappRoutes };
