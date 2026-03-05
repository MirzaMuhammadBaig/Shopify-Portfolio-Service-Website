import { orderRepository } from './order.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, ORDER_MESSAGES, ORDER_STATUS } from '../../constants';
import { getPagination, getMeta } from '../../utils/pagination';
import {
  sendOrderStatusEmail,
  sendDeliverablesSubmittedEmail,
  sendOrderApprovedEmail,
  sendRevisionRequestedEmail,
  sendReviewRequestEmail,
} from '../../utils/email';
import { uploadFileToCloudinary, deleteFromCloudinary } from '../../utils/upload';
import { config } from '../../config';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  PENDING_APPROVAL: 'Pending Approval',
  DELIVERED: 'Delivered',
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

  updateStatus: async (id: string, data: { status: string; adminNotes?: string }) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, ORDER_MESSAGES.NOT_FOUND);

    const updateData: any = { status: data.status, adminNotes: data.adminNotes, lastDeadlineReminder: null };

    if (data.status === ORDER_STATUS.IN_PROGRESS && !order.startedAt) {
      const now = new Date();
      updateData.startedAt = now;
      if (order.service?.deliveryDays && !order.estimatedDelivery) {
        updateData.estimatedDelivery = new Date(now.getTime() + order.service.deliveryDays * 86400000);
      }
    }
    if (data.status === ORDER_STATUS.DELIVERED) {
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await orderRepository.updateStatus(id, updateData);

    const emailData = {
      orderNumber: order.orderNumber,
      serviceTitle: order.service?.title || 'Custom Order',
      statusLabel: STATUS_LABELS[data.status] || data.status,
      customerName: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
      customerEmail: order.user?.email || '',
    };

    if (order.user?.email) {
      sendOrderStatusEmail({
        ...emailData, to: order.user.email, recipientName: order.user.firstName || 'Customer', isAdmin: false,
      }).catch((err) => console.error('Failed to send status email to customer:', err));
    }

    sendOrderStatusEmail({
      ...emailData, to: 'webdev.muhammad@gmail.com', recipientName: 'Admin', isAdmin: true,
    }).catch((err) => console.error('Failed to send status email to admin:', err));

    return updatedOrder;
  },

  submitDeliverables: async (id: string, files: Express.Multer.File[], githubUrl: string) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, ORDER_MESSAGES.NOT_FOUND);
    if (order.status !== ORDER_STATUS.IN_PROGRESS) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Order must be In Progress to submit deliverables');
    }
    if (!files || files.length === 0 || files.length > 3) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please upload between 1 and 3 files');
    }

    // Upload files to Cloudinary
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const isPdf = file.mimetype === 'application/pdf';
        const result = await uploadFileToCloudinary(file.buffer, 'deliverables', isPdf);
        return {
          orderId: id,
          fileUrl: result.url,
          fileType: isPdf ? 'PDF' : 'IMAGE',
          fileName: file.originalname,
          publicId: result.publicId,
        };
      })
    );

    // Save deliverables + update order status
    await orderRepository.createDeliverables(uploadedFiles);
    const updatedOrder = await orderRepository.updateOrder(id, {
      status: ORDER_STATUS.PENDING_APPROVAL,
      githubUrl,
      completedAt: new Date(),
      lastDeadlineReminder: null,
    });

    // Send emails
    const serviceTitle = order.service?.title || 'Custom Order';
    const customerName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim();
    const orderUrl = `${config.frontendUrl}/dashboard/orders/${id}`;

    if (order.user?.email) {
      sendDeliverablesSubmittedEmail({
        to: order.user.email, recipientName: order.user.firstName || 'Customer',
        orderNumber: order.orderNumber, serviceTitle, githubUrl,
        isAdmin: false, orderUrl,
      }).catch((err) => console.error('Failed to send deliverables email to customer:', err));
    }

    sendDeliverablesSubmittedEmail({
      to: 'webdev.muhammad@gmail.com', recipientName: 'Admin',
      orderNumber: order.orderNumber, serviceTitle, githubUrl,
      isAdmin: true, customerName, customerEmail: order.user?.email || '', orderUrl,
    }).catch((err) => console.error('Failed to send deliverables email to admin:', err));

    return updatedOrder;
  },

  approveOrder: async (id: string, userId: string) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, ORDER_MESSAGES.NOT_FOUND);
    if (order.userId !== userId) throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only approve your own orders');
    if (order.status !== ORDER_STATUS.PENDING_APPROVAL) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Order must be in Pending Approval to approve');
    }

    const updatedOrder = await orderRepository.updateOrder(id, {
      status: ORDER_STATUS.DELIVERED,
      deliveredAt: new Date(),
      lastDeadlineReminder: null,
    });

    const serviceTitle = order.service?.title || 'Custom Order';
    const customerName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim();

    // Email to admin
    sendOrderApprovedEmail({
      to: 'webdev.muhammad@gmail.com', recipientName: 'Admin',
      orderNumber: order.orderNumber, serviceTitle,
      isAdmin: true, customerName, customerEmail: order.user?.email || '',
    }).catch((err) => console.error('Failed to send approval email to admin:', err));

    // Email to customer
    if (order.user?.email) {
      sendOrderApprovedEmail({
        to: order.user.email, recipientName: order.user.firstName || 'Customer',
        orderNumber: order.orderNumber, serviceTitle, isAdmin: false,
      }).catch((err) => console.error('Failed to send delivery email to customer:', err));

      // Send review request
      sendReviewRequestEmail({
        to: order.user.email, recipientName: order.user.firstName || 'Customer',
        orderNumber: order.orderNumber, serviceTitle,
        ordersUrl: `${config.frontendUrl}/dashboard/orders/${id}`,
      }).catch((err) => console.error('Failed to send review request email:', err));
    }

    return updatedOrder;
  },

  requestRevision: async (id: string, userId: string) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, ORDER_MESSAGES.NOT_FOUND);
    if (order.userId !== userId) throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only request revisions on your own orders');
    if (order.status !== ORDER_STATUS.PENDING_APPROVAL) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Order must be in Pending Approval to request revision');
    }

    // Delete old deliverables from Cloudinary
    const deliverables = await orderRepository.findDeliverablesByOrderId(id);
    for (const d of deliverables) {
      if (d.publicId) {
        deleteFromCloudinary(d.publicId, d.fileType === 'PDF' ? 'raw' : 'image')
          .catch((err) => console.error('Failed to delete deliverable from Cloudinary:', err));
      }
    }
    await orderRepository.deleteDeliverablesByOrderId(id);

    // Recalculate estimated delivery
    const now = new Date();
    const updateData: any = {
      status: ORDER_STATUS.IN_PROGRESS,
      revisionCount: { increment: 1 },
      githubUrl: null,
      completedAt: null,
      lastDeadlineReminder: null,
      startedAt: now,
    };
    if (order.service?.deliveryDays) {
      updateData.estimatedDelivery = new Date(now.getTime() + order.service.deliveryDays * 86400000);
    }

    const updatedOrder = await orderRepository.updateOrder(id, updateData);

    const serviceTitle = order.service?.title || 'Custom Order';
    const customerName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim();
    const newRevisionCount = (order.revisionCount || 0) + 1;

    // Email to admin
    sendRevisionRequestedEmail({
      to: 'webdev.muhammad@gmail.com', recipientName: 'Admin',
      orderNumber: order.orderNumber, serviceTitle, revisionCount: newRevisionCount,
      isAdmin: true, customerName, customerEmail: order.user?.email || '',
    }).catch((err) => console.error('Failed to send revision email to admin:', err));

    // Email to customer
    if (order.user?.email) {
      sendRevisionRequestedEmail({
        to: order.user.email, recipientName: order.user.firstName || 'Customer',
        orderNumber: order.orderNumber, serviceTitle, revisionCount: newRevisionCount,
        isAdmin: false,
      }).catch((err) => console.error('Failed to send revision email to customer:', err));
    }

    return updatedOrder;
  },

  // Messages
  getMessages: async (orderId: string, userId: string, userRole: string) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, ORDER_MESSAGES.NOT_FOUND);
    if (userRole !== 'ADMIN' && order.userId !== userId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Access denied');
    }
    const messages = await orderRepository.findMessagesByOrderId(orderId);
    // Mark messages as read
    await orderRepository.markMessagesAsRead(orderId, userId);
    return messages;
  },

  sendMessage: async (orderId: string, senderId: string, content: string, senderRole: string) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, ORDER_MESSAGES.NOT_FOUND);
    if (order.status !== ORDER_STATUS.PENDING_APPROVAL) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Chat is only available during Pending Approval status');
    }
    if (senderRole !== 'ADMIN' && order.userId !== senderId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Access denied');
    }
    return orderRepository.createMessage({ orderId, senderId, content });
  },
};
