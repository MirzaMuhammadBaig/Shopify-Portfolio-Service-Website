import prisma from '../../config/database';

export const orderRepository = {
  findAll: (skip: number, take: number, where: Record<string, any> = {}) =>
    prisma.order.findMany({
      skip,
      take,
      where,
      include: {
        service: { select: { id: true, title: true, slug: true } },
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        customOffer: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    }),

  count: (where: Record<string, any> = {}) =>
    prisma.order.count({ where }),

  findById: (id: string) =>
    prisma.order.findUnique({
      where: { id },
      include: {
        service: true,
        user: { select: { id: true, email: true, firstName: true, lastName: true, role: true } },
        customOffer: true,
        payment: true,
        orderDeliverables: true,
      },
    }),

  findByUserId: (userId: string, skip: number, take: number, extraWhere: Record<string, any> = {}) =>
    prisma.order.findMany({
      where: { userId, ...extraWhere },
      skip,
      take,
      include: {
        service: { select: { id: true, title: true, slug: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    }),

  countByUser: (userId: string, extraWhere: Record<string, any> = {}) =>
    prisma.order.count({ where: { userId, ...extraWhere } }),

  create: (data: {
    orderNumber: string;
    userId: string;
    serviceId?: string;
    customOfferId?: string;
    totalAmount: number;
    requirements?: string;
  }) => prisma.order.create({
    data,
    include: { service: true, payment: true },
  }),

  updateStatus: (id: string, data: {
    status: string;
    adminNotes?: string;
    startedAt?: Date;
    estimatedDelivery?: Date;
    completedAt?: Date;
    deliveredAt?: Date;
  }) => prisma.order.update({
    where: { id },
    data: data as any,
    include: {
      service: { select: { id: true, title: true, slug: true } },
      user: { select: { id: true, email: true, firstName: true, lastName: true } },
      payment: true,
    },
  }),

  updateOrder: (id: string, data: Record<string, any>) =>
    prisma.order.update({
      where: { id },
      data,
      include: {
        service: true,
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        customOffer: true,
        payment: true,
        orderDeliverables: true,
      },
    }),

  getLastOrderNumber: () =>
    prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { orderNumber: true },
    }),

  // Deliverables
  createDeliverables: (data: { orderId: string; fileUrl: string; fileType: string; fileName: string; publicId: string }[]) =>
    prisma.orderDeliverable.createMany({ data }),

  findDeliverablesByOrderId: (orderId: string) =>
    prisma.orderDeliverable.findMany({ where: { orderId }, orderBy: { createdAt: 'asc' } }),

  deleteDeliverablesByOrderId: (orderId: string) =>
    prisma.orderDeliverable.deleteMany({ where: { orderId } }),

  // Messages
  createMessage: (data: { orderId: string; senderId: string; content: string }) =>
    prisma.orderMessage.create({
      data,
      include: { sender: { select: { id: true, firstName: true, lastName: true, role: true, avatar: true } } },
    }),

  findMessagesByOrderId: (orderId: string, skip: number = 0, take: number = 50) =>
    prisma.orderMessage.findMany({
      where: { orderId },
      skip,
      take,
      include: { sender: { select: { id: true, firstName: true, lastName: true, role: true, avatar: true } } },
      orderBy: { createdAt: 'asc' },
    }),

  markMessagesAsRead: (orderId: string, readerId: string) =>
    prisma.orderMessage.updateMany({
      where: { orderId, senderId: { not: readerId }, isRead: false },
      data: { isRead: true },
    }),

  countUnreadMessages: (orderId: string, userId: string) =>
    prisma.orderMessage.count({
      where: { orderId, senderId: { not: userId }, isRead: false },
    }),
};
