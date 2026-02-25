import { Request, Response } from 'express';
import { projectService } from './project.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { getParam } from '../../utils/params';
import { HTTP_STATUS, PROJECT_MESSAGES } from '../../constants';
import { uploadToCloudinary } from '../../utils/upload';

export const projectController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { projects, meta } = await projectService.getAll(req.query as any);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: PROJECT_MESSAGES.FETCHED, data: projects, meta });
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.getBySlug(getParam(req, 'slug'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: PROJECT_MESSAGES.FETCHED, data: project });
  }),

  getFeatured: asyncHandler(async (_req: Request, res: Response) => {
    const projects = await projectService.getFeatured();
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: PROJECT_MESSAGES.FETCHED, data: projects });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (req.file) {
      const { url } = await uploadToCloudinary(req.file.buffer, 'projects');
      req.body.image = url;
    }
    const project = await projectService.create(req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.CREATED, message: PROJECT_MESSAGES.CREATED, data: project });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    if (req.file) {
      const { url } = await uploadToCloudinary(req.file.buffer, 'projects');
      req.body.image = url;
    }
    const project = await projectService.update(getParam(req, 'id'), req.body);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: PROJECT_MESSAGES.UPDATED, data: project });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await projectService.delete(getParam(req, 'id'));
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: PROJECT_MESSAGES.DELETED });
  }),
};
