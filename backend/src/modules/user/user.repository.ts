import prisma from '../../config/database';
import { Role } from '../../constants/roles';

export const userRepository = {
  findAll: (skip: number, take: number) =>
    prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),

  count: () => prisma.user.count(),

  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    }),

  update: (id: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  }) => prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  }),

  updateRole: (id: string, role: Role) =>
    prisma.user.update({ where: { id }, data: { role } }),

  toggleActive: (id: string, isActive: boolean) =>
    prisma.user.update({ where: { id }, data: { isActive } }),

  delete: (id: string) =>
    prisma.user.delete({ where: { id } }),
};
