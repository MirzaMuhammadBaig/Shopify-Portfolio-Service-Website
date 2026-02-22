import { Request, Response } from 'express';
import { userService } from './user.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { getParam } from '../../utils/params';
import { HTTP_STATUS, USER_MESSAGES } from '../../constants';

export const userController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { users, meta } = await userService.getAll(req.query as any);
    sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: USER_MESSAGES.USERS_FETCHED,
      data: users,
      meta,
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getById(getParam(req, 'id'));
    sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: USER_MESSAGES.USERS_FETCHED,
      data: user,
    });
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateProfile(req.user!.userId, req.body);
    sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: USER_MESSAGES.PROFILE_UPDATED,
      data: user,
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await userService.delete(getParam(req, 'id'));
    sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: USER_MESSAGES.USER_DELETED,
    });
  }),
};
