import prisma from '../../config/database';

export const reviewRepository = {
  findAll: (skip: number, take: number, where: Record<string, any> = {}) =>
    prisma.review.findMany({
      skip,
      take,
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        service: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

  count: (where: Record<string, any> = {}) =>
    prisma.review.count({ where }),

  findById: (id: string) =>
    prisma.review.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        service: { select: { id: true, title: true } },
      },
    }),

  findByUserAndService: (userId: string, serviceId: string) =>
    prisma.review.findUnique({
      where: { userId_serviceId: { userId, serviceId } },
    }),

  findByService: (serviceId: string, skip: number, take: number) =>
    prisma.review.findMany({
      where: { serviceId, isVisible: true },
      skip,
      take,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

  countByService: (serviceId: string) =>
    prisma.review.count({ where: { serviceId, isVisible: true } }),

  create: (data: {
    userId: string;
    serviceId: string;
    rating: number;
    comment?: string;
  }) => prisma.review.create({
    data,
    include: {
      user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      service: { select: { id: true, title: true } },
    },
  }),

  update: (id: string, data: { rating?: number; comment?: string }) =>
    prisma.review.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.review.delete({ where: { id } }),

  toggleVisibility: (id: string, isVisible: boolean) =>
    prisma.review.update({ where: { id }, data: { isVisible } }),
};
