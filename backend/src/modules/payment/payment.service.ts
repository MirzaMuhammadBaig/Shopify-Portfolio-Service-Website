import { Safepay } from '@sfpy/node-sdk';
import { paymentRepository } from './payment.repository';
import { orderRepository } from '../order/order.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, PAYMENT_MESSAGES, PAYMENT_METHODS, MANUAL_PAYMENT_METHODS, ORDER_STATUS } from '../../constants';
import { getPagination, getMeta } from '../../utils/pagination';
import { sendPaymentNotificationEmail } from '../../utils/email';
import { config } from '../../config';

const safepay = new Safepay({
  environment: config.payment.safepay.environment as 'sandbox' | 'production',
  apiKey: config.payment.safepay.apiKey,
  v1Secret: config.payment.safepay.v1Secret,
  webhookSecret: config.payment.safepay.webhookSecret,
} as any);

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

    // Auto-confirm order and notify admin
    if (payment.orderId) {
      const order = await orderRepository.findById(payment.orderId);
      if (order) {
        if (order.status === ORDER_STATUS.PENDING) {
          await orderRepository.updateStatus(order.id, { status: ORDER_STATUS.CONFIRMED });
        }

        sendPaymentNotificationEmail({
          orderNumber: order.orderNumber,
          serviceTitle: order.service?.title || 'Custom Order',
          amount: Number(order.totalAmount),
          method: 'Safepay (Automated)',
          transactionId: tracker,
          customerName: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
          customerEmail: order.user?.email || '',
        }).catch((err) => console.error('Failed to send Safepay payment notification:', err));
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
