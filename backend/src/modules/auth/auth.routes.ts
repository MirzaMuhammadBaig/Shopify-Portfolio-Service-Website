import { Router } from 'express';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';
import { authenticate, validate } from '../../middleware';
import { authLimiter } from '../../middleware';

const router = Router();

router.post('/register', authLimiter, validate(authValidation.register), authController.register);
router.post('/login', authLimiter, validate(authValidation.login), authController.login);
router.post('/google', authLimiter, validate(authValidation.googleAuth), authController.googleAuth);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authLimiter, validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/contact', authLimiter, authController.contact);
router.post('/refresh', validate(authValidation.refreshToken), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);

export { router as authRoutes };
