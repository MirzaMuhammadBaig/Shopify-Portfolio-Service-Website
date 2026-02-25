import prisma from '../../config/database';

interface FaqCreateData {
  question: string;
  answer: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const faqRepository = {
  findAll: (skip: number, take: number, where: Record<string, any> = {}) =>
    prisma.faq.findMany({
      skip,
      take,
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    }),

  count: (where: Record<string, any> = {}) =>
    prisma.faq.count({ where }),

  findById: (id: string) =>
    prisma.faq.findUnique({ where: { id } }),

  create: (data: FaqCreateData) =>
    prisma.faq.create({ data }),

  update: (id: string, data: Partial<FaqCreateData>) =>
    prisma.faq.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.faq.delete({ where: { id } }),
};
