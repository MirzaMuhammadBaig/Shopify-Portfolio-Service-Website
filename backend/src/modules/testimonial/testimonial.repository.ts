import prisma from '../../config/database';

interface TestimonialCreateData {
  name: string;
  role?: string;
  rating?: number;
  comment: string;
  isActive?: boolean;
  sortOrder?: number;
}

export const testimonialRepository = {
  findAll: (skip: number, take: number, where: Record<string, any> = {}) =>
    prisma.testimonial.findMany({
      skip,
      take,
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    }),

  count: (where: Record<string, any> = {}) =>
    prisma.testimonial.count({ where }),

  findById: (id: string) =>
    prisma.testimonial.findUnique({ where: { id } }),

  create: (data: TestimonialCreateData) =>
    prisma.testimonial.create({ data }),

  update: (id: string, data: Partial<TestimonialCreateData>) =>
    prisma.testimonial.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.testimonial.delete({ where: { id } }),
};
