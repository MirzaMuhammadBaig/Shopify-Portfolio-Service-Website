import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../services/service.service';

const QUERY_KEYS = {
  services: ['services'],
  featured: ['services', 'featured'],
  detail: (slug) => ['services', slug],
};

export function useServices(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.services, params],
    queryFn: () => serviceService.getAll(params).then((res) => res.data),
  });
}

export function useFeaturedServices() {
  return useQuery({
    queryKey: QUERY_KEYS.featured,
    queryFn: () => serviceService.getFeatured().then((res) => res.data),
  });
}

export function useServiceBySlug(slug) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(slug),
    queryFn: () => serviceService.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => serviceService.create(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services }),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => serviceService.update(id, data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services }),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => serviceService.delete(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services }),
  });
}
