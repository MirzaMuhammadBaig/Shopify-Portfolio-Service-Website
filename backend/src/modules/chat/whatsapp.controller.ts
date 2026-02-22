import { Request, Response } from 'express';
import { whatsappService } from './whatsapp.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendResponse } from '../../utils/api-response';
import { HTTP_STATUS } from '../../constants';

export const whatsappController = {
  verifyWebhook: (req: Request, res: Response): void => {
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'] as string;

    const result = whatsappService.verifyWebhook(mode, token, challenge);
    if (result) {
      res.status(HTTP_STATUS.OK).send(result);
    } else {
      res.status(HTTP_STATUS.FORBIDDEN).send('Verification failed');
    }
  },

  handleWebhook: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          if (change.field === 'messages') {
            const messages = change.value?.messages || [];
            for (const msg of messages) {
              console.log('Received WhatsApp message:', {
                from: msg.from,
                type: msg.type,
                text: msg.text?.body,
              });
            }
          }
        }
      }
    }

    res.status(HTTP_STATUS.OK).send('OK');
  }),

  sendMessage: asyncHandler(async (req: Request, res: Response) => {
    const { to, message } = req.body;
    const result = await whatsappService.sendMessage(to, message);
    sendResponse({ res, statusCode: HTTP_STATUS.OK, message: 'Message sent via WhatsApp', data: result });
  }),
};
