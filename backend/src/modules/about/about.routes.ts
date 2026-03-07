import { Router } from 'express';
import { aboutController } from './about.controller';
import { aboutValidation } from './about.validation';
import { authenticate, authorize, validate, uploadImage } from '../../middleware';
import { ROLES } from '../../constants';

const router = Router();

// Public - get all about page data in one call
router.get('/', aboutController.getAll);

// ─── STATS ───────────────────────────────────────────────
router.get('/stats', aboutController.getStats);
router.post('/stats', authenticate, authorize(ROLES.ADMIN), validate(aboutValidation.createStat), aboutController.createStat);
router.put('/stats/:id', authenticate, authorize(ROLES.ADMIN), validate(aboutValidation.updateStat), aboutController.updateStat);
router.delete('/stats/:id', authenticate, authorize(ROLES.ADMIN), aboutController.deleteStat);

// ─── STORY ───────────────────────────────────────────────
router.get('/story', aboutController.getStory);
router.put('/story', authenticate, authorize(ROLES.ADMIN), uploadImage, validate(aboutValidation.upsertStory), aboutController.upsertStory);

// ─── EXPERIENCE ──────────────────────────────────────────
router.get('/experiences', aboutController.getExperiences);
router.post('/experiences', authenticate, authorize(ROLES.ADMIN), validate(aboutValidation.createExperience), aboutController.createExperience);
router.put('/experiences/:id', authenticate, authorize(ROLES.ADMIN), validate(aboutValidation.updateExperience), aboutController.updateExperience);
router.delete('/experiences/:id', authenticate, authorize(ROLES.ADMIN), aboutController.deleteExperience);

// ─── TEAM MEMBERS ────────────────────────────────────────
router.get('/members', aboutController.getMembers);
router.post('/members', authenticate, authorize(ROLES.ADMIN), uploadImage, validate(aboutValidation.createMember), aboutController.createMember);
router.put('/members/:id', authenticate, authorize(ROLES.ADMIN), uploadImage, validate(aboutValidation.updateMember), aboutController.updateMember);
router.delete('/members/:id', authenticate, authorize(ROLES.ADMIN), aboutController.deleteMember);

// ─── CERTIFICATES ────────────────────────────────────────
router.get('/certificates', aboutController.getCertificates);
router.post('/certificates', authenticate, authorize(ROLES.ADMIN), uploadImage, validate(aboutValidation.createCertificate), aboutController.createCertificate);
router.put('/certificates/:id', authenticate, authorize(ROLES.ADMIN), uploadImage, validate(aboutValidation.updateCertificate), aboutController.updateCertificate);
router.delete('/certificates/:id', authenticate, authorize(ROLES.ADMIN), aboutController.deleteCertificate);

export { router as aboutRoutes };
