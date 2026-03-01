import prisma from '../../config/database';
import { Prisma } from '../../../generated/prisma/client';

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

  findAllTags: () =>
    prisma.blogPost.findMany({ where: { isPublished: true }, select: { tags: true } }),

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

  searchPosts: async (
    search: string,
    skip: number,
    take: number,
    options: { tag?: string; publishedOnly?: boolean } = {},
  ) => {
    const pattern = `%${search}%`;
    const conditions: Prisma.Sql[] = [];

    if (options.publishedOnly !== false) {
      conditions.push(Prisma.sql`is_published = true`);
    }

    conditions.push(Prisma.sql`(
      title ILIKE ${pattern}
      OR COALESCE(excerpt, '') ILIKE ${pattern}
      OR content ILIKE ${pattern}
      OR tags::text ILIKE ${pattern}
    )`);

    if (options.tag) {
      const tagJson = JSON.stringify([options.tag]);
      conditions.push(Prisma.sql`tags::jsonb @> ${tagJson}::jsonb`);
    }

    const whereClause = Prisma.join(conditions, ' AND ');

    return prisma.$queryRaw<any[]>`
      SELECT
        id, title, slug, content, excerpt,
        cover_image AS "coverImage",
        meta_title AS "metaTitle",
        meta_desc AS "metaDesc",
        tags,
        is_published AS "isPublished",
        published_at AS "publishedAt",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM blog_posts
      WHERE ${whereClause}
      ORDER BY
        CASE WHEN tags::text ILIKE ${pattern} THEN 0 ELSE 1 END,
        CASE WHEN title ILIKE ${pattern} THEN 0 ELSE 1 END,
        created_at DESC
      LIMIT ${take} OFFSET ${skip}
    `;
  },

  countSearch: async (
    search: string,
    options: { tag?: string; publishedOnly?: boolean } = {},
  ) => {
    const pattern = `%${search}%`;
    const conditions: Prisma.Sql[] = [];

    if (options.publishedOnly !== false) {
      conditions.push(Prisma.sql`is_published = true`);
    }

    conditions.push(Prisma.sql`(
      title ILIKE ${pattern}
      OR COALESCE(excerpt, '') ILIKE ${pattern}
      OR content ILIKE ${pattern}
      OR tags::text ILIKE ${pattern}
    )`);

    if (options.tag) {
      const tagJson = JSON.stringify([options.tag]);
      conditions.push(Prisma.sql`tags::jsonb @> ${tagJson}::jsonb`);
    }

    const whereClause = Prisma.join(conditions, ' AND ');

    const result = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) AS count FROM blog_posts WHERE ${whereClause}
    `;
    return Number(result[0].count);
  },
};
