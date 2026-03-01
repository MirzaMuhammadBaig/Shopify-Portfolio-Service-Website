import { orderRepository } from './order.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, ORDER_MESSAGES, ORDER_STATUS } from '../../constants';
import { getPagination, getMeta } from '../../utils/pagination';
import { sendOrderStatusEmail } from '../../utils/email';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const generateOrderNumber = async (): Promise<string> => {
  const last = await orderRepository.getLastOrderNumber();
  const prefix = 'ORD';
  if (!last?.orderNumber) return `${prefix}-000001`;

  const lastNum = parseInt(last.orderNumber.split('-')[1], 10);
  const nextNum = (lastNum + 1).toString().padStart(6, '0');
  return `${prefix}-${nextNum}`;
};

export const orderService = {
  getAll: async (query: { page?: string; limit?: string; status?: string; email?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const where: Record<string, any> = {};
    if (query.status) where.status = query.status;
    if (query.email) where.user = { email: { contains: query.email, mode: 'insensitive' } };

    const [orders, total] = await Promise.all([
      orderRepository.findAll(skip, take, where),
      orderRepository.count(where),
    ]);
    return { orders, meta: getMeta(total, page, limit) };
  },

  getByUser: async (userId: string, query: { page?: string; limit?: string; status?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const extraWhere: Record<string, any> = {};
    if (query.status) extraWhere.status = query.status;

    const [orders, total] = await Promise.all([
      orderRepository.findByUserId(userId, skip, take, extraWhere),
      orderRepository.countByUser(userId, extraWhere),
    ]);
    return { orders, meta: getMeta(total, page, limit) };
  },

  getById: async (id: string) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, ORDER_MESSAGES.NOT_FOUND);
    return order;
  },

  create: async (data: {
    userId: string;
    serviceId?: string;
    customOfferId?: string;
    totalAmount: number;
    requirements?: string;
  }) => {
    const orderNumber = await generateOrderNumber();
    return orderRepository.create({ ...data, orderNumber });
  },

  updateStatus: async (id: string, data: {
    status: string;
    adminNotes?: string;
  }) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, ORDER_MESSAGES.NOT_FOUND);

    const updateData: any = { status: data.status, adminNotes: data.adminNotes };

    if (data.status === ORDER_STATUS.IN_PROGRESS && !order.startedAt) {
      updateData.startedAt = new Date();
    }
    if (data.status === ORDER_STATUS.COMPLETED) {
      updateData.completedAt = new Date();
    }
    if (data.status === ORDER_STATUS.DELIVERED) {
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await orderRepository.updateStatus(id, updateData);

    // Send status change emails to customer and admin
    const emailData = {
      orderNumber: order.orderNumber,
      serviceTitle: order.service?.title || 'Custom Order',
      statusLabel: STATUS_LABELS[data.status] || data.status,
      customerName: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
      customerEmail: order.user?.email || '',
    };

    if (order.user?.email) {
      sendOrderStatusEmail({
        ...emailData,
        to: order.user.email,
        recipientName: order.user.firstName || 'Customer',
        isAdmin: false,
      }).catch((err) => console.error('Failed to send status email to customer:', err));
    }

    sendOrderStatusEmail({
      ...emailData,
      to: 'webdev.muhammad@gmail.com',
      recipientName: 'Admin',
      isAdmin: true,
    }).catch((err) => console.error('Failed to send status email to admin:', err));

    return updatedOrder;
  },
};
