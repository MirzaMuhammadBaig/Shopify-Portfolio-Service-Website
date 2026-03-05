import { Server, Socket } from 'socket.io';
import { orderRepository } from '../modules/order/order.repository';
import { ORDER_STATUS } from '../constants';

export function orderChatHandler(io: Server, socket: Socket) {
  const user = (socket as any).user;

  socket.on('joinOrder', async (orderId: string) => {
    try {
      const order = await orderRepository.findById(orderId);
      if (!order) return;
      // Only order owner or admin can join
      if (user.role !== 'ADMIN' && order.userId !== user.userId) return;

      socket.join(`order:${orderId}`);

      // Mark messages as read when joining
      await orderRepository.markMessagesAsRead(orderId, user.userId);
      io.to(`order:${orderId}`).emit('messagesRead', { orderId, readerId: user.userId });
    } catch (err) {
      console.error('[Socket] Error joining order:', err);
    }
  });

  socket.on('leaveOrder', (orderId: string) => {
    socket.leave(`order:${orderId}`);
  });

  socket.on('sendMessage', async (data: { orderId: string; content: string }) => {
    try {
      const order = await orderRepository.findById(data.orderId);
      if (!order) return;
      if (order.status !== ORDER_STATUS.PENDING_APPROVAL) return;
      if (user.role !== 'ADMIN' && order.userId !== user.userId) return;

      const message = await orderRepository.createMessage({
        orderId: data.orderId,
        senderId: user.userId,
        content: data.content,
      });

      io.to(`order:${data.orderId}`).emit('newMessage', message);
    } catch (err) {
      console.error('[Socket] Error sending message:', err);
    }
  });

  socket.on('markRead', async (data: { orderId: string }) => {
    try {
      await orderRepository.markMessagesAsRead(data.orderId, user.userId);
      io.to(`order:${data.orderId}`).emit('messagesRead', { orderId: data.orderId, readerId: user.userId });
    } catch (err) {
      console.error('[Socket] Error marking read:', err);
    }
  });

  socket.on('typing', (data: { orderId: string }) => {
    socket.to(`order:${data.orderId}`).emit('userTyping', {
      orderId: data.orderId,
      userId: user.userId,
      name: user.email,
    });
  });
}
