import { Request, Response } from 'express';
import { testimonialService } from './testimonial.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { getParam } from '../../utils/params';
import { HTTP_STATUS, TESTIMONIAL_MESSAGES } from '../../constants';

export const testimonialController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { testimonials, meta } = await testimonialService.getAll(req.query as any);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: TESTIMONIAL_MESSAGES.FETCHED, data: testimonials, meta });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await testimonialService.create(req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: TESTIMONIAL_MESSAGES.CREATED, data: testimonial });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await testimonialService.update(getParam(req, 'id'), req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: TESTIMONIAL_MESSAGES.UPDATED, data: testimonial });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await testimonialService.delete(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: TESTIMONIAL_MESSAGES.DELETED });
  }),
};
