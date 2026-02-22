import { Router } from 'express';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';
import { authenticate, validate } from '../../middleware';
import { authLimiter } from '../../middleware';

const router = Router();

router.post('/register', authLimiter, validate(authValidation.register), authController.register);
router.post('/login', authLimiter, validate(authValidation.login), authController.login);
router.get('/verify-email', authController.verifyEmail);
router.post('/contact', authLimiter, authController.contact);
router.post('/refresh', validate(authValidation.refreshToken), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);

export { router as authRoutes };
