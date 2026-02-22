import { Request, Response } from 'express';
import { blogService } from './blog.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { getParam } from '../../utils/params';
import { HTTP_STATUS, BLOG_MESSAGES } from '../../constants';

export const blogController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { posts, meta } = await blogService.getAll(req.query as any);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: BLOG_MESSAGES.FETCHED, data: posts, meta });
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.getBySlug(getParam(req, 'slug'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: BLOG_MESSAGES.FETCHED, data: post });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.create(req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: BLOG_MESSAGES.CREATED, data: post });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.update(getParam(req, 'id'), req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: BLOG_MESSAGES.UPDATED, data: post });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await blogService.delete(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: BLOG_MESSAGES.DELETED });
  }),
};
