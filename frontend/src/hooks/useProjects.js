import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/project.service';

const QUERY_KEYS = {
  projects: ['projects'],
  featured: ['projects', 'featured'],
  detail: (slug) => ['projects', slug],
};

export function useProjects(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.projects, params],
    queryFn: () => projectService.getAll(params).then((res) => res.data),
  });
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: QUERY_KEYS.featured,
    queryFn: () => projectService.getFeatured().then((res) => res.data),
  });
}

export function useProjectBySlug(slug) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(slug),
    queryFn: () => projectService.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => projectService.create(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects }),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => projectService.update(id, data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => projectService.delete(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects }),
  });
}
