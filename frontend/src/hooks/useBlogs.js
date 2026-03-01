import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '../services/blog.service';

const QUERY_KEYS = {
  blogs: ['blogs'],
  tags: ['blogs', 'tags'],
  detail: (slug) => ['blogs', slug],
};

export function useBlogs(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.blogs, params],
    queryFn: () => blogService.getAll(params).then((res) => res.data),
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: QUERY_KEYS.tags,
    queryFn: () => blogService.getTags().then((res) => res.data),
  });
}

export function useBlogBySlug(slug) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(slug),
    queryFn: () => blogService.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => blogService.create(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blogs }),
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => blogService.update(id, data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blogs }),
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => blogService.delete(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blogs }),
  });
}
