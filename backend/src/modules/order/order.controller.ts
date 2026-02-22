import { Request, Response } from 'express';
import { orderService } from './order.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { getParam } from '../../utils/params';
import { HTTP_STATUS, ORDER_MESSAGES } from '../../constants';

export const orderController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { orders, meta } = await orderService.getAll(req.query as any);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ORDER_MESSAGES.FETCHED, data: orders, meta });
  }),

  getMyOrders: asyncHandler(async (req: Request, res: Response) => {
    const { orders, meta } = await orderService.getByUser(req.user!.userId, req.query as any);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ORDER_MESSAGES.FETCHED, data: orders, meta });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.getById(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ORDER_MESSAGES.FETCHED, data: order });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.create({ ...req.body, userId: req.user!.userId });
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: ORDER_MESSAGES.CREATED, data: order });
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.updateStatus(getParam(req, 'id'), req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: ORDER_MESSAGES.STATUS_UPDATED, data: order });
  }),
};
