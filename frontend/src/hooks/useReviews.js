import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';

const QUERY_KEYS = {
  reviews: ['reviews'],
  byService: (serviceId) => ['reviews', 'service', serviceId],
};

export function useReviews(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.reviews, params],
    queryFn: () => reviewService.getAll(params).then((res) => res.data),
  });
}

export function useServiceReviews(serviceId, params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.byService(serviceId), params],
    queryFn: () => reviewService.getByService(serviceId, params).then((res) => res.data),
    enabled: !!serviceId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => reviewService.create(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews }),
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => reviewService.update(id, data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews }),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => reviewService.delete(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews }),
  });
}
