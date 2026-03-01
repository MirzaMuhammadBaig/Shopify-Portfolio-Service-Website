import { chatRepository } from './chat.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, CHAT_MESSAGES } from '../../constants';
import { sendChatMessageNotificationEmail } from '../../utils/email';
import { config } from '../../config';

const AUTO_RESPONSES: Record<string, string> = {
  hello: 'Hello! Welcome to our Shopify services. How can we help you today?',
  pricing: 'Our pricing varies based on the service. Please check our services page or describe your project for a custom quote.',
  timeline: 'Project timelines depend on complexity. We will provide an estimated timeline after reviewing your requirements.',
  support: 'Our support team is available Monday-Friday, 9 AM - 6 PM. An admin will respond to your message shortly.',
};

const getAutoResponse = (message: string): string | null => {
  const lower = message.toLowerCase();
  for (const [keyword, response] of Object.entries(AUTO_RESPONSES)) {
    if (lower.includes(keyword)) return response;
  }
  return null;
};

export const chatService = {
  getConversations: async (userId?: string, sort?: string) =>
    chatRepository.findConversations(userId, sort),

  getConversation: async (id: string) => {
    const conversation = await chatRepository.findConversationById(id);
    if (!conversation) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, CHAT_MESSAGES.CONVERSATION_NOT_FOUND);
    }
    return conversation;
  },

  createConversation: async (userId: string, subject?: string) =>
    chatRepository.createConversation(userId, subject),

  sendMessage: async (conversationId: string, sender: 'USER' | 'ADMIN' | 'SYSTEM', content: string) => {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, CHAT_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    const message = await chatRepository.addMessage({ conversationId, sender, content });

    // Auto-generate subject from first user message if not set
    if (!conversation.subject && sender === 'USER') {
      const autoSubject = content.length > 50 ? content.substring(0, 50) + '...' : content;
      await chatRepository.updateConversationSubject(conversationId, autoSubject);
    }

    if (sender === 'USER') {
      const autoReply = getAutoResponse(content);
      if (autoReply) {
        await chatRepository.addMessage({
          conversationId,
          sender: 'SYSTEM',
          content: autoReply,
        });
      }
    }

    // Email notification with smart deduplication
    const conversationSubject = conversation.subject || 'New conversation';
    const messagePreview = content.length > 200 ? content.substring(0, 200) + '...' : content;

    if (sender === 'USER') {
      const existingUnread = await chatRepository.countUnreadBySender(conversationId, 'USER');
      if (existingUnread <= 1) {
        sendChatMessageNotificationEmail({
          to: 'webdev.muhammad@gmail.com',
          recipientName: 'Admin',
          senderName: `${conversation.user.firstName} ${conversation.user.lastName}`,
          conversationSubject,
          messagePreview,
          chatUrl: `${config.frontendUrl}/admin/chat`,
          isAdmin: true,
        }).catch((err) => console.error('Chat notification email failed:', err));
      }
    } else if (sender === 'ADMIN') {
      const existingUnread = await chatRepository.countUnreadBySender(conversationId, 'ADMIN');
      if (existingUnread <= 1) {
        sendChatMessageNotificationEmail({
          to: conversation.user.email!,
          recipientName: conversation.user.firstName,
          senderName: 'ShopifyPro Support',
          conversationSubject,
          messagePreview,
          chatUrl: `${config.frontendUrl}/dashboard/chat`,
          isAdmin: false,
        }).catch((err) => console.error('Chat notification email failed:', err));
      }
    }

    return message;
  },

  updateSubject: async (conversationId: string, subject: string) => {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, CHAT_MESSAGES.CONVERSATION_NOT_FOUND);
    }
    return chatRepository.updateConversationSubject(conversationId, subject);
  },

  markAsRead: async (conversationId: string) =>
    chatRepository.markAsRead(conversationId),

  closeConversation: async (id: string) => {
    const conversation = await chatRepository.findConversationById(id);
    if (!conversation) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, CHAT_MESSAGES.CONVERSATION_NOT_FOUND);
    }
    return chatRepository.closeConversation(id);
  },

  getUnreadCount: async (userId?: string) =>
    chatRepository.getUnreadCount(userId),
};
