import { Request, Response } from 'express';
import { paymentService } from './payment.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { getParam } from '../../utils/params';
import { HTTP_STATUS, PAYMENT_MESSAGES } from '../../constants';

export const paymentController = {
  getMethods: asyncHandler(async (_req: Request, res: Response) => {
    const data = paymentService.getPaymentMethods();
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: PAYMENT_MESSAGES.FETCHED, data });
  }),

  createManualPayment: asyncHandler(async (req: Request, res: Response) => {
    const payment = await paymentService.createManualPayment({
      ...req.body,
      userId: req.user!.userId,
    });
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: PAYMENT_MESSAGES.CREATED, data: payment });
  }),

  createStripeSession: asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentService.createStripeSession({
      orderId: req.body.orderId,
      userId: req.user!.userId,
    });
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: PAYMENT_MESSAGES.STRIPE_SESSION_CREATED, data: result });
  }),

  getByOrderId: asyncHandler(async (req: Request, res: Response) => {
    const payment = await paymentService.getByOrderId(getParam(req, 'orderId'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: PAYMENT_MESSAGES.FETCHED, data: payment });
  }),

  verify: asyncHandler(async (req: Request, res: Response) => {
    const payment = await paymentService.verifyPayment(getParam(req, 'id'), req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: PAYMENT_MESSAGES.VERIFIED, data: payment });
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { payments, meta } = await paymentService.getAll(req.query as any);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: PAYMENT_MESSAGES.FETCHED, data: payments, meta });
  }),
};
