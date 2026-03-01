import { Safepay } from '@sfpy/node-sdk';
import { paymentRepository } from './payment.repository';
import { orderRepository } from '../order/order.repository';
import { chatRepository } from '../chat/chat.repository';
import { chatService } from '../chat/chat.service';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, PAYMENT_MESSAGES, PAYMENT_METHODS, MANUAL_PAYMENT_METHODS, ORDER_STATUS } from '../../constants';
import { getPagination, getMeta } from '../../utils/pagination';
import { sendPaymentNotificationEmail, sendPaymentSuccessEmail, sendOrderStatusEmail } from '../../utils/email';
import { config } from '../../config';

const safepay = new Safepay({
  environment: config.payment.safepay.environment as 'sandbox' | 'production',
  apiKey: config.payment.safepay.apiKey,
  v1Secret: config.payment.safepay.v1Secret,
  webhookSecret: config.payment.safepay.webhookSecret,
} as any);

/** Shared logic: auto-start order + send emails + chat message after payment confirmed */
const handlePaymentConfirmed = async (order: any) => {
  const serviceTitle = order.service?.title || 'Custom Order';
  const customerName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim();
  const customerEmail = order.user?.email || '';
  const now = new Date();

  // Auto-start order: set IN_PROGRESS with timeline
  if (order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.CONFIRMED) {
    const updateData: any = { status: ORDER_STATUS.IN_PROGRESS, startedAt: now };
    if (order.service?.deliveryDays) {
      updateData.estimatedDelivery = new Date(now.getTime() + order.service.deliveryDays * 86400000);
    }
    await orderRepository.updateStatus(order.id, updateData);
  }

  const estimatedDelivery = order.service?.deliveryDays
    ? new Date(now.getTime() + order.service.deliveryDays * 86400000)
    : undefined;

  // Email to user: payment success
  if (customerEmail) {
    sendPaymentSuccessEmail({
      to: customerEmail,
      recipientName: order.user?.firstName || 'Customer',
      orderNumber: order.orderNumber,
      serviceTitle,
      amount: Number(order.totalAmount),
      estimatedDelivery,
      dashboardUrl: `${config.frontendUrl}/dashboard/orders`,
    }).catch((err) => console.error('Failed to send payment success email:', err));
  }

  // Email to both: order status "In Progress"
  const emailData = {
    orderNumber: order.orderNumber,
    serviceTitle,
    statusLabel: 'In Progress',
    customerName,
    customerEmail,
  };

  if (customerEmail) {
    sendOrderStatusEmail({
      ...emailData,
      to: customerEmail,
      recipientName: order.user?.firstName || 'Customer',
      isAdmin: false,
    }).catch((err) => console.error('Failed to send status email to customer:', err));
  }

  sendOrderStatusEmail({
    ...emailData,
    to: 'webdev.muhammad@gmail.com',
    recipientName: 'Admin',
    isAdmin: true,
  }).catch((err) => console.error('Failed to send status email to admin:', err));

  // Chat: thank-you message to user
  const deliveryNote = estimatedDelivery
    ? ` Your estimated delivery date is ${estimatedDelivery.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.`
    : '';

  const thankYouMessage = `Thank you for your purchase! Your order #${order.orderNumber} for "${serviceTitle}" has been confirmed and is now in progress. Our team has started working on your project right away!${deliveryNote} We'll keep you updated on the progress. If you have any questions, feel free to message us here!`;

  try {
    // Find existing conversation or create new one
    const conversations = await chatRepository.findConversations(order.userId);
    let conversationId: string;

    if (conversations.length > 0) {
      conversationId = conversations[0].id;
    } else {
      const newConv = await chatRepository.createConversation(
        order.userId,
        `Order #${order.orderNumber} — ${serviceTitle}`,
      );
      conversationId = newConv.id;
    }

    // Send as ADMIN — triggers email notification via chat deduplication system
    await chatService.sendMessage(conversationId, 'ADMIN', thankYouMessage);
  } catch (err) {
    console.error('Failed to send thank-you chat message:', err);
  }
};

export const paymentService = {
  getPaymentMethods: () => ({
    methods: [
      {
        id: PAYMENT_METHODS.SAFEPAY,
        name: 'Credit / Debit Card / Wallet',
        type: 'automated',
        instructions: 'Pay securely with Visa, Mastercard, JazzCash, EasyPaisa or bank transfer via Safepay.',
      },
      {
        id: PAYMENT_METHODS.PAYONEER,
        name: 'Payoneer',
        type: 'manual',
        accountName: config.payment.payoneer.name,
        email: config.payment.payoneer.email,
        instructions: 'Send payment to the Payoneer account below, then upload the transaction screenshot and enter the transaction reference.',
      },
    ],
  }),

  createManualPayment: async (data: {
    orderId: string;
    userId: string;
    method: string;
    transactionId: string;
    screenshotBuffer?: Buffer;
    screenshotFilename?: string;
  }) => {
    if (!(MANUAL_PAYMENT_METHODS as readonly string[]).includes(data.method)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, PAYMENT_MESSAGES.INVALID_METHOD);
    }

    const order = await orderRepository.findById(data.orderId);
    if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Order not found');
    if (order.userId !== data.userId) throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not your order');

    const existing = await paymentRepository.findByOrderId(data.orderId);
    if (existing && existing.status === 'PAID') {
      throw new ApiError(HTTP_STATUS.CONFLICT, PAYMENT_MESSAGES.ALREADY_PAID);
    }

    // Send payment details + screenshot to admin email
    sendPaymentNotificationEmail({
      orderNumber: order.orderNumber,
      serviceTitle: order.service?.title || 'Custom Order',
      amount: Number(order.totalAmount),
      method: data.method,
      transactionId: data.transactionId,
      customerName: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
      customerEmail: order.user?.email || '',
      screenshotBuffer: data.screenshotBuffer,
      screenshotFilename: data.screenshotFilename,
    }).catch((err) => console.error('Failed to send payment notification email:', err));

    if (existing) {
      return paymentRepository.updateStatus(existing.id, {
        status: 'PENDING',
        transactionId: data.transactionId,
      });
    }

    return paymentRepository.create({
      orderId: data.orderId,
      userId: data.userId,
      amount: Number(order.totalAmount),
      method: data.method,
      transactionId: data.transactionId,
    });
  },

  createSafepaySession: async (data: {
    orderId: string;
    userId: string;
  }) => {
    const order = await orderRepository.findById(data.orderId);
    if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Order not found');
    if (order.userId !== data.userId) throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not your order');

    const existing = await paymentRepository.findByOrderId(data.orderId);
    if (existing && existing.status === 'PAID') {
      throw new ApiError(HTTP_STATUS.CONFLICT, PAYMENT_MESSAGES.ALREADY_PAID);
    }

    let payment;
    if (existing) {
      payment = await paymentRepository.updateStatus(existing.id, { status: 'PENDING' });
    } else {
      payment = await paymentRepository.create({
        orderId: data.orderId,
        userId: data.userId,
        amount: Number(order.totalAmount),
        method: PAYMENT_METHODS.SAFEPAY,
      });
    }

    const { token } = await safepay.payments.create({
      amount: Number(order.totalAmount),
      currency: 'PKR',
    });

    // Store the tracker token so we can match it on webhook callback
    await paymentRepository.updateStatus(payment.id, {
      status: 'PENDING',
      transactionId: token,
    });

    const checkoutUrl = safepay.checkout.create({
      token,
      orderId: order.orderNumber,
      cancelUrl: `${config.frontendUrl}/checkout/${data.orderId}`,
      redirectUrl: `${config.frontendUrl}/payment/success/${data.orderId}`,
      source: 'custom',
      webhooks: true,
    });

    return {
      paymentId: payment.id,
      url: checkoutUrl,
    };
  },

  handleSafepayWebhook: async (req: { body?: any; headers?: any }) => {
    const isValid = safepay.verify.webhook(req);
    if (!isValid) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid webhook signature');
    }

    const tracker = req.body?.data?.tracker;
    if (!tracker) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Missing tracker token');
    }

    // Find the payment by the tracker token we stored as transactionId
    const payments = await paymentRepository.findAll(0, 1, { transactionId: tracker });
    const payment = payments[0];

    if (!payment) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Payment not found for this tracker');
    }

    if (payment.status === 'PAID') {
      return payment;
    }

    const updatedPayment = await paymentRepository.updateStatus(payment.id, {
      status: 'PAID',
      paidAt: new Date(),
    });

    // Auto-start order, send emails, and chat message
    if (payment.orderId) {
      const order = await orderRepository.findById(payment.orderId);
      if (order) {
        // Admin payment notification
        sendPaymentNotificationEmail({
          orderNumber: order.orderNumber,
          serviceTitle: order.service?.title || 'Custom Order',
          amount: Number(order.totalAmount),
          method: 'Safepay (Automated)',
          transactionId: tracker,
          customerName: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
          customerEmail: order.user?.email || '',
        }).catch((err) => console.error('Failed to send Safepay payment notification:', err));

        // Auto-start + user email + chat message
        await handlePaymentConfirmed(order);
      }
    }

    return updatedPayment;
  },

  verifyPayment: async (id: string, data: { status: string }) => {
    const payment = await paymentRepository.findById(id);
    if (!payment) throw new ApiError(HTTP_STATUS.NOT_FOUND, PAYMENT_MESSAGES.NOT_FOUND);

    const updateData: any = { status: data.status };
    if (data.status === 'PAID') {
      updateData.paidAt = new Date();
    }

    const updatedPayment = await paymentRepository.updateStatus(id, updateData);

    // When admin verifies manual payment as PAID, auto-start the order
    if (data.status === 'PAID' && payment.orderId) {
      const order = await orderRepository.findById(payment.orderId);
      if (order) {
        await handlePaymentConfirmed(order);
      }
    }

    return updatedPayment;
  },

  getByOrderId: async (orderId: string) => {
    return paymentRepository.findByOrderId(orderId);
  },

  getAll: async (query: { page?: string; limit?: string; status?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const where: Record<string, any> = {};
    if (query.status) where.status = query.status;

    const [payments, total] = await Promise.all([
      paymentRepository.findAll(skip, take, where),
      paymentRepository.count(where),
    ]);
    return { payments, meta: getMeta(total, page, limit) };
  },
};
