import { Request, Response } from 'express';
import { aboutService } from './about.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { getParam } from '../../utils/params';
import { HTTP_STATUS, ABOUT_MESSAGES } from '../../constants';
import { uploadToCloudinary } from '../../utils/upload';

export const aboutController = {
  // ─── PUBLIC ────────────────────────────────────────────
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const data = await aboutService.getAll();
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.FETCHED, data });
  }),

  // ─── STATS ─────────────────────────────────────────────
  getStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await aboutService.getStats();
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.FETCHED, data: stats });
  }),

  createStat: asyncHandler(async (req: Request, res: Response) => {
    const stat = await aboutService.createStat(req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: ABOUT_MESSAGES.CREATED, data: stat });
  }),

  updateStat: asyncHandler(async (req: Request, res: Response) => {
    const stat = await aboutService.updateStat(getParam(req, 'id'), req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.UPDATED, data: stat });
  }),

  deleteStat: asyncHandler(async (req: Request, res: Response) => {
    await aboutService.deleteStat(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.DELETED });
  }),

  // ─── STORY ─────────────────────────────────────────────
  getStory: asyncHandler(async (_req: Request, res: Response) => {
    const story = await aboutService.getStory();
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.FETCHED, data: story });
  }),

  upsertStory: asyncHandler(async (req: Request, res: Response) => {
    if (req.file) {
      const { url } = await uploadToCloudinary(req.file.buffer, 'about');
      req.body.teamImage = url;
    }
    if (typeof req.body.highlights === 'string') {
      req.body.highlights = JSON.parse(req.body.highlights);
    }
    const story = await aboutService.upsertStory(req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.UPDATED, data: story });
  }),

  // ─── EXPERIENCE ────────────────────────────────────────
  getExperiences: asyncHandler(async (_req: Request, res: Response) => {
    const experiences = await aboutService.getExperiences();
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.FETCHED, data: experiences });
  }),

  createExperience: asyncHandler(async (req: Request, res: Response) => {
    const exp = await aboutService.createExperience(req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: ABOUT_MESSAGES.CREATED, data: exp });
  }),

  updateExperience: asyncHandler(async (req: Request, res: Response) => {
    const exp = await aboutService.updateExperience(getParam(req, 'id'), req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.UPDATED, data: exp });
  }),

  deleteExperience: asyncHandler(async (req: Request, res: Response) => {
    await aboutService.deleteExperience(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.DELETED });
  }),

  // ─── TEAM MEMBERS ──────────────────────────────────────
  getMembers: asyncHandler(async (_req: Request, res: Response) => {
    const members = await aboutService.getMembers();
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.FETCHED, data: members });
  }),

  createMember: asyncHandler(async (req: Request, res: Response) => {
    if (req.file) {
      const { url } = await uploadToCloudinary(req.file.buffer, 'about/team');
      req.body.image = url;
    }
    const member = await aboutService.createMember(req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: ABOUT_MESSAGES.CREATED, data: member });
  }),

  updateMember: asyncHandler(async (req: Request, res: Response) => {
    if (req.file) {
      const { url } = await uploadToCloudinary(req.file.buffer, 'about/team');
      req.body.image = url;
    }
    const member = await aboutService.updateMember(getParam(req, 'id'), req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.UPDATED, data: member });
  }),

  deleteMember: asyncHandler(async (req: Request, res: Response) => {
    await aboutService.deleteMember(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.DELETED });
  }),

  // ─── CERTIFICATES ──────────────────────────────────────
  getCertificates: asyncHandler(async (_req: Request, res: Response) => {
    const certs = await aboutService.getCertificates();
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.FETCHED, data: certs });
  }),

  createCertificate: asyncHandler(async (req: Request, res: Response) => {
    if (req.file) {
      const { url } = await uploadToCloudinary(req.file.buffer, 'about/certificates');
      req.body.image = url;
    }
    const cert = await aboutService.createCertificate(req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: ABOUT_MESSAGES.CREATED, data: cert });
  }),

  updateCertificate: asyncHandler(async (req: Request, res: Response) => {
    if (req.file) {
      const { url } = await uploadToCloudinary(req.file.buffer, 'about/certificates');
      req.body.image = url;
    }
    const cert = await aboutService.updateCertificate(getParam(req, 'id'), req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.UPDATED, data: cert });
  }),

  deleteCertificate: asyncHandler(async (req: Request, res: Response) => {
    await aboutService.deleteCertificate(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ABOUT_MESSAGES.DELETED });
  }),
};
