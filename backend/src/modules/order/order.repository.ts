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
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        customOffer: true,
        payment: true,
      },
    }),

  findByUserId: (userId: string, skip: number, take: number) =>
    prisma.order.findMany({
      where: { userId },
      skip,
      take,
      include: {
        service: { select: { id: true, title: true, slug: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    }),

  countByUser: (userId: string) =>
    prisma.order.count({ where: { userId } }),

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
    completedAt?: Date;
    deliveredAt?: Date;
  }) => prisma.order.update({ where: { id }, data: data as any }),

  getLastOrderNumber: () =>
    prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { orderNumber: true },
    }),
};
