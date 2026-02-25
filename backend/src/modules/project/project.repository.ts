import prisma from '../../config/database';

interface ProjectCreateData {
  title: string;
  slug: string;
  category: string;
  description: string;
  image?: string;
  tags?: any;
  liveUrl?: string;
  results?: any;
  isFeatured?: boolean;
  sortOrder?: number;
}

export const projectRepository = {
  findAll: (skip: number, take: number, where: Record<string, any> = {}) =>
    prisma.project.findMany({
      skip,
      take,
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    }),

  count: (where: Record<string, any> = {}) =>
    prisma.project.count({ where }),

  findById: (id: string) =>
    prisma.project.findUnique({ where: { id } }),

  findBySlug: (slug: string) =>
    prisma.project.findUnique({ where: { slug } }),

  findAllSlugs: () =>
    prisma.project.findMany({ select: { slug: true } }),

  create: (data: ProjectCreateData) =>
    prisma.project.create({ data }),

  update: (id: string, data: Partial<ProjectCreateData>) =>
    prisma.project.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.project.delete({ where: { id } }),

  findFeatured: () =>
    prisma.project.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { sortOrder: 'asc' },
    }),
};
