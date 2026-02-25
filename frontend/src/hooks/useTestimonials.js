import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialService } from '../services/testimonial.service';

const QUERY_KEYS = {
  testimonials: ['testimonials'],
};

export function useTestimonials(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.testimonials, params],
    queryFn: () => testimonialService.getAll(params).then((res) => res.data),
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => testimonialService.create(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testimonials }),
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => testimonialService.update(id, data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testimonials }),
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => testimonialService.delete(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testimonials }),
  });
}
