import prisma from '../../config/database';

export const adminService = {
  getDashboardStats: async () => {
    const [
      totalUsers,
      totalOrders,
      totalServices,
      totalRevenue,
      pendingOrders,
      recentOrders,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.service.count(),
      prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          service: { select: { title: true } },
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, firstName: true, lastName: true, email: true, createdAt: true },
      }),
    ]);

    return {
      totalUsers,
      totalOrders,
      totalServices,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingOrders,
      recentOrders,
      recentUsers,
    };
  },
};
