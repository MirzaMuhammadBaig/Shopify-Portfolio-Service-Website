import { config } from '../../config';

interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template';
  text?: { body: string };
  template?: { name: string; language: { code: string } };
}

export const whatsappService = {
  sendMessage: async (to: string, message: string): Promise<any> => {
    const { apiUrl, phoneNumberId, accessToken } = config.whatsapp;

    if (!phoneNumberId || !accessToken) {
      throw new Error('WhatsApp API credentials not configured');
    }

    const payload: WhatsAppMessage = {
      to,
      type: 'text',
      text: { body: message },
    };

    const response = await fetch(`${apiUrl}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        ...payload,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
    }

    return response.json();
  },

  sendTemplate: async (to: string, templateName: string, languageCode: string = 'en_US'): Promise<any> => {
    const { apiUrl, phoneNumberId, accessToken } = config.whatsapp;

    const response = await fetch(`${apiUrl}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
    }

    return response.json();
  },

  verifyWebhook: (mode: string, token: string, challenge: string): string | null => {
    if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
      return challenge;
    }
    return null;
  },
};
