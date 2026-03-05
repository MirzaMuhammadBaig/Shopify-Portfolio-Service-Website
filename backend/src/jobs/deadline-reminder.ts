import prisma from '../config/database';
import { sendDeadlineReminderEmail } from '../utils/email';

const SEVERITY_LEVELS = ['TWO_DAYS', 'ONE_DAY', 'TWELVE_HOURS', 'OVERDUE'] as const;
type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

const SEVERITY_INDEX: Record<SeverityLevel, number> = {
  TWO_DAYS: 0,
  ONE_DAY: 1,
  TWELVE_HOURS: 2,
  OVERDUE: 3,
};

function formatTimeRemaining(hoursLeft: number): string {
  if (hoursLeft <= 0) return 'Overdue';
  if (hoursLeft < 1) return `${Math.round(hoursLeft * 60)} minutes`;
  if (hoursLeft < 24) return `${Math.round(hoursLeft)} hours`;
  const days = Math.round((hoursLeft / 24) * 10) / 10;
  return days === 1 ? '1 day' : `${days} days`;
}

function determineSeverity(hoursRemaining: number): SeverityLevel | null {
  if (hoursRemaining <= 0) return 'OVERDUE';
  if (hoursRemaining <= 12) return 'TWELVE_HOURS';
  if (hoursRemaining <= 24) return 'ONE_DAY';
  if (hoursRemaining <= 48) return 'TWO_DAYS';
  return null;
}

function shouldSendReminder(currentSeverity: SeverityLevel, lastReminder: string | null): boolean {
  if (!lastReminder) return true;
  const lastIndex = SEVERITY_INDEX[lastReminder as SeverityLevel];
  if (lastIndex === undefined) return true;
  return SEVERITY_INDEX[currentSeverity] > lastIndex;
}

export async function checkDeadlineReminders(): Promise<void> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: 'IN_PROGRESS',
        estimatedDelivery: { not: null },
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        service: { select: { title: true } },
      },
    });

    const now = Date.now();

    for (const order of orders) {
      const estimatedDelivery = order.estimatedDelivery!;
      const hoursRemaining = (estimatedDelivery.getTime() - now) / (1000 * 60 * 60);

      const severity = determineSeverity(hoursRemaining);
      if (!severity) continue;

      if (!shouldSendReminder(severity, order.lastDeadlineReminder)) continue;

      const timeRemaining = formatTimeRemaining(hoursRemaining);
      const serviceTitle = order.service?.title || 'Custom Order';
      const customerName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim();
      const customerEmail = order.user?.email || '';

      const emailBaseData = {
        orderNumber: order.orderNumber,
        serviceTitle,
        customerName,
        customerEmail,
        severity,
        timeRemaining,
        estimatedDelivery,
      };

      if (customerEmail) {
        sendDeadlineReminderEmail({
          ...emailBaseData,
          to: customerEmail,
          recipientName: order.user?.firstName || 'Customer',
          isAdmin: false,
        }).catch((err) => console.error(`Failed to send deadline email to customer for order ${order.orderNumber}:`, err));
      }

      sendDeadlineReminderEmail({
        ...emailBaseData,
        to: 'webdev.muhammad@gmail.com',
        recipientName: 'Admin',
        isAdmin: true,
      }).catch((err) => console.error(`Failed to send deadline email to admin for order ${order.orderNumber}:`, err));

      await prisma.order.update({
        where: { id: order.id },
        data: { lastDeadlineReminder: severity as any },
      });

      console.log(`[Deadline Reminder] Sent ${severity} reminder for order ${order.orderNumber}`);
    }
  } catch (error) {
    console.error('[Deadline Reminder] Error checking deadlines:', error);
  }
}
