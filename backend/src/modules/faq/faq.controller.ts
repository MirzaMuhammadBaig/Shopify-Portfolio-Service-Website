import { Request, Response } from 'express';
import { faqService } from './faq.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { getParam } from '../../utils/params';
import { HTTP_STATUS, FAQ_MESSAGES } from '../../constants';

export const faqController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { faqs, meta } = await faqService.getAll(req.query as any);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: FAQ_MESSAGES.FETCHED, data: faqs, meta });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const faq = await faqService.create(req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: FAQ_MESSAGES.CREATED, data: faq });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const faq = await faqService.update(getParam(req, 'id'), req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: FAQ_MESSAGES.UPDATED, data: faq });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await faqService.delete(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: FAQ_MESSAGES.DELETED });
  }),
};
