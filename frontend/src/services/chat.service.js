import api from './api';
import { API_ENDPOINTS } from '../constants';

export const chatService = {
  getConversations: () => api.get(API_ENDPOINTS.CHAT.CONVERSATIONS),
  getConversation: (id) => api.get(API_ENDPOINTS.CHAT.CONVERSATION(id)),
  createConversation: (data) => api.post(API_ENDPOINTS.CHAT.CONVERSATIONS, data),
  sendMessage: (conversationId, data) =>
    api.post(API_ENDPOINTS.CHAT.MESSAGES(conversationId), data),
  markAsRead: (conversationId) =>
    api.patch(API_ENDPOINTS.CHAT.MARK_READ(conversationId)),
  getUnreadCount: () => api.get(API_ENDPOINTS.CHAT.UNREAD),
};
