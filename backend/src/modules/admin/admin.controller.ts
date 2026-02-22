import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { HTTP_STATUS } from '../../constants';

export const adminController = {
  getDashboardStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await adminService.getDashboardStats();
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: 'Dashboard stats fetched', data: stats });
  }),
};
