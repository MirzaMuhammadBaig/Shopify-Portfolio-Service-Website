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

  submitDeliverables: asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const order = await orderService.submitDeliverables(getParam(req, 'id'), files, req.body.githubUrl);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: 'Deliverables submitted successfully', data: order });
  }),

  approveOrder: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.approveOrder(getParam(req, 'id'), req.user!.userId);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: 'Order approved successfully', data: order });
  }),

  requestRevision: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.requestRevision(getParam(req, 'id'), req.user!.userId);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: 'Revision requested successfully', data: order });
  }),

  getMessages: asyncHandler(async (req: Request, res: Response) => {
    const messages = await orderService.getMessages(getParam(req, 'id'), req.user!.userId, req.user!.role);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: 'Messages fetched', data: messages });
  }),

  sendMessage: asyncHandler(async (req: Request, res: Response) => {
    const message = await orderService.sendMessage(getParam(req, 'id'), req.user!.userId, req.body.content, req.user!.role);
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: 'Message sent', data: message });
  }),
};
