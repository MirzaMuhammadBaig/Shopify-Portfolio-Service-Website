import { Request, Response } from 'express';
import { reviewService } from './review.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { getParam } from '../../utils/params';
import { HTTP_STATUS, REVIEW_MESSAGES, ROLES } from '../../constants';

export const reviewController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { reviews, meta } = await reviewService.getAll(req.query as any);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: REVIEW_MESSAGES.FETCHED, data: reviews, meta });
  }),

  getAdminAll: asyncHandler(async (req: Request, res: Response) => {
    const { reviews, meta } = await reviewService.getAdminAll(req.query as any);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: REVIEW_MESSAGES.FETCHED, data: reviews, meta });
  }),

  getMyReviews: asyncHandler(async (req: Request, res: Response) => {
    const { reviews, meta } = await reviewService.getByUser(req.user!.userId, req.query as any);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: REVIEW_MESSAGES.FETCHED, data: reviews, meta });
  }),

  getByService: asyncHandler(async (req: Request, res: Response) => {
    const { reviews, meta } = await reviewService.getByService(getParam(req, 'serviceId'), req.query as any);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: REVIEW_MESSAGES.FETCHED, data: reviews, meta });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const review = await reviewService.create({ ...req.body, userId: req.user!.userId });
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: REVIEW_MESSAGES.CREATED, data: review });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const review = await reviewService.update(getParam(req, 'id'), req.user!.userId, req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: REVIEW_MESSAGES.UPDATED, data: review });
  }),

  adminUpdate: asyncHandler(async (req: Request, res: Response) => {
    const review = await reviewService.adminUpdate(getParam(req, 'id'), req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: REVIEW_MESSAGES.UPDATED, data: review });
  }),

  adminDelete: asyncHandler(async (req: Request, res: Response) => {
    await reviewService.adminDelete(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: REVIEW_MESSAGES.DELETED });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const isAdmin = req.user!.role === ROLES.ADMIN;
    await reviewService.delete(getParam(req, 'id'), req.user!.userId, isAdmin);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: REVIEW_MESSAGES.DELETED });
  }),

  toggleVisibility: asyncHandler(async (req: Request, res: Response) => {
    const review = await reviewService.toggleVisibility(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: 'Review visibility toggled', data: review });
  }),
};
