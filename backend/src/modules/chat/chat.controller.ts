import { Request, Response } from 'express';
import { chatService } from './chat.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { getParam } from '../../utils/params';
import { HTTP_STATUS, CHAT_MESSAGES, ROLES } from '../../constants';

export const chatController = {
  getConversations: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.role === ROLES.ADMIN ? undefined : req.user!.userId;
    const conversations = await chatService.getConversations(userId);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: CHAT_MESSAGES.FETCHED, data: conversations });
  }),

  getConversation: asyncHandler(async (req: Request, res: Response) => {
    const conversation = await chatService.getConversation(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: CHAT_MESSAGES.FETCHED, data: conversation });
  }),

  createConversation: asyncHandler(async (req: Request, res: Response) => {
    const conversation = await chatService.createConversation(req.user!.userId, req.body.subject);
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: CHAT_MESSAGES.CONVERSATION_CREATED, data: conversation });
  }),

  sendMessage: asyncHandler(async (req: Request, res: Response) => {
    const sender = req.user!.role === ROLES.ADMIN ? 'ADMIN' : 'USER';
    const message = await chatService.sendMessage(getParam(req, 'id'), sender, req.body.content);
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: CHAT_MESSAGES.MESSAGE_SENT, data: message });
  }),

  markAsRead: asyncHandler(async (req: Request, res: Response) => {
    await chatService.markAsRead(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: 'Messages marked as read' });
  }),

  getUnreadCount: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.role === ROLES.ADMIN ? undefined : req.user!.userId;
    const count = await chatService.getUnreadCount(userId);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: 'Unread count fetched', data: { count } });
  }),
};
