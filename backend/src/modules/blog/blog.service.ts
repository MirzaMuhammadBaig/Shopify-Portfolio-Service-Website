import { blogRepository } from './blog.repository';
import { ApiError } from '../../utils/api-error';
import { HTTP_STATUS, BLOG_MESSAGES } from '../../constants';
import { getPagination, getMeta } from '../../utils/pagination';
import { generateSlug } from '../../utils/slug';

export const blogService = {
  getAll: async (query: { page?: string; limit?: string; published?: string }) => {
    const { skip, take, page, limit } = getPagination(query);
    const where: Record<string, any> = {};
    if (query.published === 'true') where.isPublished = true;

    const [posts, total] = await Promise.all([
      blogRepository.findAll(skip, take, where),
      blogRepository.count(where),
    ]);
    return { posts, meta: getMeta(total, page, limit) };
  },

  getBySlug: async (slug: string) => {
    const post = await blogRepository.findBySlug(slug);
    if (!post) throw new ApiError(HTTP_STATUS.NOT_FOUND, BLOG_MESSAGES.NOT_FOUND);
    return post;
  },

  create: async (data: {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    metaTitle?: string;
    metaDesc?: string;
    tags?: any;
    isPublished?: boolean;
  }) => {
    const allSlugs = await blogRepository.findAllSlugs();
    const existingSlugs = allSlugs.map((s: { slug: string }) => s.slug);
    let slug = generateSlug(data.title);
    let counter = 1;
    while (existingSlugs.includes(slug)) {
      slug = `${generateSlug(data.title)}-${counter}`;
      counter++;
    }

    return blogRepository.create({
      ...data,
      slug,
      publishedAt: data.isPublished ? new Date() : undefined,
    });
  },

  update: async (id: string, data: any) => {
    const post = await blogRepository.findById(id);
    if (!post) throw new ApiError(HTTP_STATUS.NOT_FOUND, BLOG_MESSAGES.NOT_FOUND);

    if (data.title && data.title !== post.title) {
      const allSlugs = await blogRepository.findAllSlugs();
      const existingSlugs = allSlugs.filter((s: { slug: string }) => s.slug !== post.slug).map((s: { slug: string }) => s.slug);
      let slug = generateSlug(data.title);
      let counter = 1;
      while (existingSlugs.includes(slug)) {
        slug = `${generateSlug(data.title)}-${counter}`;
        counter++;
      }
      data.slug = slug;
    }

    if (data.isPublished && !post.isPublished) {
      data.publishedAt = new Date();
    }

    return blogRepository.update(id, data);
  },

  delete: async (id: string) => {
    const post = await blogRepository.findById(id);
    if (!post) throw new ApiError(HTTP_STATUS.NOT_FOUND, BLOG_MESSAGES.NOT_FOUND);
    await blogRepository.delete(id);
  },
};
