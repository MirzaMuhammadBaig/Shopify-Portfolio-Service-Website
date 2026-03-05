import prisma from '../config/database';
import { sendUnreadMessageEmail } from '../utils/email';
import { config } from '../config';

export async function checkUnreadMessages(): Promise<void> {
  try {
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);

    // Find unread messages older than 15 minutes that haven't had a reminder sent
    const unreadMessages = await prisma.orderMessage.findMany({
      where: {
        isRead: false,
        reminderSent: false,
        createdAt: { lte: fifteenMinAgo },
        order: { status: 'PENDING_APPROVAL' },
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
        order: {
          select: {
            id: true,
            orderNumber: true,
            userId: true,
            user: { select: { id: true, email: true, firstName: true } },
          },
        },
      },
    });

    for (const message of unreadMessages) {
      const senderName = `${message.sender.firstName || ''} ${message.sender.lastName || ''}`.trim() || 'Someone';
      const isFromAdmin = message.sender.role === 'ADMIN';

      // Determine who should receive the reminder
      let recipientEmail: string;
      let recipientName: string;
      let orderUrl: string;

      if (isFromAdmin) {
        // Admin sent the message → remind the user
        recipientEmail = message.order.user?.email || '';
        recipientName = message.order.user?.firstName || 'Customer';
        orderUrl = `${config.frontendUrl}/dashboard/orders/${message.order.id}`;
      } else {
        // User sent the message → remind the admin
        recipientEmail = 'webdev.muhammad@gmail.com';
        recipientName = 'Admin';
        orderUrl = `${config.frontendUrl}/admin/orders/${message.order.id}`;
      }

      if (!recipientEmail) continue;

      sendUnreadMessageEmail({
        to: recipientEmail,
        recipientName,
        senderName,
        orderNumber: message.order.orderNumber,
        messagePreview: message.content,
        orderUrl,
      }).catch((err) => console.error(`[Unread Reminder] Failed to send for message ${message.id}:`, err));

      await prisma.orderMessage.update({
        where: { id: message.id },
        data: { reminderSent: true },
      });

      console.log(`[Unread Reminder] Sent reminder for message ${message.id} in order ${message.order.orderNumber}`);
    }
  } catch (error) {
    console.error('[Unread Reminder] Error checking unread messages:', error);
  }
}
