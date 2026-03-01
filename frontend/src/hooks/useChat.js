import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chat.service';

const QUERY_KEYS = {
  conversations: ['conversations'],
  conversation: (id) => ['conversations', id],
  unread: ['unread-count'],
};

export function useConversations(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.conversations, params],
    queryFn: () => chatService.getConversations(params).then((res) => res.data),
  });
}

export function useConversation(id) {
  return useQuery({
    queryKey: QUERY_KEYS.conversation(id),
    queryFn: () => chatService.getConversation(id).then((res) => res.data),
    enabled: !!id,
    refetchInterval: 5000,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => chatService.createConversation(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations }),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, data }) =>
      chatService.sendMessage(conversationId, data).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversation(variables.conversationId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, data }) =>
      chatService.updateSubject(conversationId, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId) =>
      chatService.markAsRead(conversationId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.unread });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations });
    },
  });
}

export function useUnreadCount(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.unread,
    queryFn: () => chatService.getUnreadCount().then((res) => res.data),
    refetchInterval: 30000,
    enabled: options.enabled !== false,
  });
}
