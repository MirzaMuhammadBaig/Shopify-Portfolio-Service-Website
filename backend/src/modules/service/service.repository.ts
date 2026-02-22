import prisma from '../../config/database';

interface ServiceCreateData {
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  price: number;
  features?: any;
  icon?: string;
  image?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}

export const serviceRepository = {
  findAll: (skip: number, take: number, where: Record<string, any> = {}) =>
    prisma.service.findMany({
      skip,
      take,
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    }),

  count: (where: Record<string, any> = {}) =>
    prisma.service.count({ where }),

  findById: (id: string) =>
    prisma.service.findUnique({ where: { id } }),

  findBySlug: (slug: string) =>
    prisma.service.findUnique({ where: { slug } }),

  findAllSlugs: () =>
    prisma.service.findMany({ select: { slug: true } }),

  create: (data: ServiceCreateData) =>
    prisma.service.create({ data }),

  update: (id: string, data: Partial<ServiceCreateData>) =>
    prisma.service.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.service.delete({ where: { id } }),

  findFeatured: () =>
    prisma.service.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { sortOrder: 'asc' },
    }),
};
