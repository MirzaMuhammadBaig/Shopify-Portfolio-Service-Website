import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useOrderMessages } from './useOrders';

export function useOrderChat(orderId, enabled = true) {
  const socket = useSocket();
  const { data: initialMessages } = useOrderMessages(enabled ? orderId : null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Sync initial messages
  useEffect(() => {
    if (initialMessages?.data) {
      setMessages(initialMessages.data);
    }
  }, [initialMessages]);

  // Socket events
  useEffect(() => {
    if (!socket || !orderId || !enabled) return;

    socket.emit('joinOrder', orderId);

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      // Mark as read immediately since we're in the chat
      socket.emit('markRead', { orderId });
    };

    const handleMessagesRead = ({ readerId }) => {
      setMessages((prev) =>
        prev.map((m) => (m.senderId !== readerId ? { ...m, isRead: true } : m))
      );
    };

    const handleTyping = () => {
      setIsTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messagesRead', handleMessagesRead);
    socket.on('userTyping', handleTyping);

    return () => {
      socket.emit('leaveOrder', orderId);
      socket.off('newMessage', handleNewMessage);
      socket.off('messagesRead', handleMessagesRead);
      socket.off('userTyping', handleTyping);
      clearTimeout(typingTimeoutRef.current);
    };
  }, [socket, orderId, enabled]);

  const sendMessage = useCallback((content) => {
    if (!socket || !content.trim()) return;
    socket.emit('sendMessage', { orderId, content: content.trim() });
  }, [socket, orderId]);

  const emitTyping = useCallback(() => {
    if (!socket) return;
    socket.emit('typing', { orderId });
  }, [socket, orderId]);

  const markAsRead = useCallback(() => {
    if (!socket) return;
    socket.emit('markRead', { orderId });
  }, [socket, orderId]);

  return { messages, sendMessage, emitTyping, markAsRead, isTyping };
}
