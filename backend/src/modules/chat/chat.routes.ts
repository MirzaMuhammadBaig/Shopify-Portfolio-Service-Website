import { Router } from 'express';
import { chatController } from './chat.controller';
import { chatValidation } from './chat.validation';
import { authenticate, validate } from '../../middleware';

const router = Router();

router.get('/conversations', authenticate, chatController.getConversations);
router.get('/conversations/:id', authenticate, chatController.getConversation);
router.post('/conversations', authenticate, validate(chatValidation.createConversation), chatController.createConversation);
router.post('/conversations/:id/messages', authenticate, validate(chatValidation.sendMessage), chatController.sendMessage);
router.patch('/conversations/:id/read', authenticate, chatController.markAsRead);
router.get('/unread', authenticate, chatController.getUnreadCount);

export { router as chatRoutes };
