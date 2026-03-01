import prisma from '../../config/database';

const REVIEW_INCLUDE = {
  user: { select: { id: true, email: true, firstName: true, lastName: true, avatar: true } },
  service: { select: { id: true, title: true, slug: true } },
};

export const reviewRepository = {
  findAll: (skip: number, take: number, where: Record<string, any> = {}) =>
    prisma.review.findMany({
      skip,
      take,
      where,
      include: REVIEW_INCLUDE,
      orderBy: { createdAt: 'desc' },
    }),

  count: (where: Record<string, any> = {}) =>
    prisma.review.count({ where }),

  findById: (id: string) =>
    prisma.review.findUnique({
      where: { id },
      include: REVIEW_INCLUDE,
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

  findByUserId: (userId: string, skip: number, take: number) =>
    prisma.review.findMany({
      where: { userId },
      skip,
      take,
      include: {
        service: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

  countByUser: (userId: string) =>
    prisma.review.count({ where: { userId } }),

  countByUserToday: (userId: string) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return prisma.review.count({
      where: { userId, createdAt: { gte: startOfDay } },
    });
  },

  create: (data: {
    userId: string;
    serviceId: string;
    rating: number;
    comment?: string;
  }) => prisma.review.create({
    data,
    include: REVIEW_INCLUDE,
  }),

  update: (id: string, data: { rating?: number; comment?: string; editCount?: number }) =>
    prisma.review.update({ where: { id }, data, include: REVIEW_INCLUDE }),

  delete: (id: string) =>
    prisma.review.delete({ where: { id } }),

  toggleVisibility: (id: string, isVisible: boolean) =>
    prisma.review.update({ where: { id }, data: { isVisible }, include: REVIEW_INCLUDE }),
};
