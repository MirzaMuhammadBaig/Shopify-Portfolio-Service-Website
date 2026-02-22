import { Request, Response } from 'express';
import { serviceService } from './service.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { getParam } from '../../utils/params';
import { HTTP_STATUS, SERVICE_MESSAGES } from '../../constants';

export const serviceController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { services, meta } = await serviceService.getAll(req.query as any);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: SERVICE_MESSAGES.FETCHED, data: services, meta });
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceService.getBySlug(getParam(req, 'slug'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: SERVICE_MESSAGES.FETCHED, data: service });
  }),

  getFeatured: asyncHandler(async (_req: Request, res: Response) => {
    const services = await serviceService.getFeatured();
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: SERVICE_MESSAGES.FETCHED, data: services });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceService.create(req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: SERVICE_MESSAGES.CREATED, data: service });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceService.update(getParam(req, 'id'), req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: SERVICE_MESSAGES.UPDATED, data: service });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await serviceService.delete(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: SERVICE_MESSAGES.DELETED });
  }),
};
