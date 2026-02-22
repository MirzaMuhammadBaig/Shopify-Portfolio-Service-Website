import { Request, Response } from 'express';
import { authService } from './auth.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { HTTP_STATUS, AUTH_MESSAGES } from '../../constants';
import { sendContactEmail } from '../../utils/email';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phone } = req.body;
    const result = await authService.register({ email, password, firstName, lastName, phone });

    sendResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: 'Registration successful! Please check your email to verify your account.',
      data: result,
    });
  }),

  verifyEmail: asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query as { token: string };
    const result = await authService.verifyEmail(token);

    sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: 'Email verified successfully. You can now log in.',
      data: result,
    });
  }),

  contact: asyncHandler(async (req: Request, res: Response) => {
    const { name, email, message } = req.body;

    await sendContactEmail({ name, email, message });

    sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: 'Message sent successfully! We will get back to you soon.',
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: result,
    });
  }),

  refreshToken: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);

    sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: AUTH_MESSAGES.REFRESH_SUCCESS,
      data: tokens,
    });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.user!.userId);

    sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    });
  }),

  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getProfile(req.user!.userId);

    sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: 'Profile fetched successfully',
      data: user,
    });
  }),
};
