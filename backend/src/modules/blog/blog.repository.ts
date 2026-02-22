import prisma from '../../config/database';

export const blogRepository = {
  findAll: (skip: number, take: number, where: Record<string, any> = {}) =>
    prisma.blogPost.findMany({
      skip,
      take,
      where,
      orderBy: { createdAt: 'desc' },
    }),

  count: (where: Record<string, any> = {}) =>
    prisma.blogPost.count({ where }),

  findById: (id: string) =>
    prisma.blogPost.findUnique({ where: { id } }),

  findBySlug: (slug: string) =>
    prisma.blogPost.findUnique({ where: { slug } }),

  findAllSlugs: () =>
    prisma.blogPost.findMany({ select: { slug: true } }),

  create: (data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    metaTitle?: string;
    metaDesc?: string;
    tags?: any;
    isPublished?: boolean;
    publishedAt?: Date;
  }) => prisma.blogPost.create({ data }),

  update: (id: string, data: Record<string, any>) =>
    prisma.blogPost.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.blogPost.delete({ where: { id } }),
};
