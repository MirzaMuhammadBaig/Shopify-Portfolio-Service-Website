import prisma from '../../config/database';

export const paymentRepository = {
  findByOrderId: (orderId: string) =>
    prisma.payment.findUnique({
      where: { orderId },
      include: {
        order: { include: { service: { select: { id: true, title: true, slug: true } } } },
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    }),

  findById: (id: string) =>
    prisma.payment.findUnique({
      where: { id },
      include: {
        order: { include: { service: { select: { id: true, title: true, slug: true } } } },
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    }),

  findAll: (skip: number, take: number, where: Record<string, any> = {}) =>
    prisma.payment.findMany({
      skip,
      take,
      where,
      include: {
        order: { select: { id: true, orderNumber: true } },
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

  count: (where: Record<string, any> = {}) =>
    prisma.payment.count({ where }),

  create: (data: {
    orderId: string;
    userId: string;
    amount: number;
    method: string;
    transactionId?: string;
  }) => prisma.payment.create({
    data,
    include: { order: true },
  }),

  updateStatus: (id: string, data: {
    status: string;
    transactionId?: string;
    paidAt?: Date;
  }) => prisma.payment.update({
    where: { id },
    data: data as any,
    include: { order: true },
  }),
};
