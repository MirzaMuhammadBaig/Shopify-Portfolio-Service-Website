import { paymentRepository } from './payment.repository';
import { orderRepository } from '../order/order.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, PAYMENT_MESSAGES, PAYMENT_METHODS, MANUAL_PAYMENT_METHODS } from '../../constants';
import { getPagination, getMeta } from '../../utils/pagination';
import { sendPaymentNotificationEmail } from '../../utils/email';
import { config } from '../../config';

export const paymentService = {
  getPaymentMethods: () => ({
    methods: [
      {
        id: PAYMENT_METHODS.STRIPE,
        name: 'Credit / Debit Card',
        type: 'automated',
        instructions: 'Pay securely with Visa, Mastercard, or any debit/credit card via Stripe.',
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

  createStripeSession: async (data: {
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
        method: PAYMENT_METHODS.STRIPE,
      });
    }

    // Stripe Checkout integration placeholder
    // When STRIPE_SECRET_KEY is configured, implement:
    // const stripe = new Stripe(config.payment.stripe.secretKey);
    // const session = await stripe.checkout.sessions.create({ ... });
    // return { sessionId: session.id, url: session.url, paymentId: payment.id };

    return {
      paymentId: payment.id,
      message: 'Stripe is not configured yet. Please use an alternative payment method.',
    };
  },

  verifyPayment: async (id: string, data: { status: string }) => {
    const payment = await paymentRepository.findById(id);
    if (!payment) throw new ApiError(HTTP_STATUS.NOT_FOUND, PAYMENT_MESSAGES.NOT_FOUND);

    const updateData: any = { status: data.status };
    if (data.status === 'PAID') {
      updateData.paidAt = new Date();
    }

    return paymentRepository.updateStatus(id, updateData);
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
