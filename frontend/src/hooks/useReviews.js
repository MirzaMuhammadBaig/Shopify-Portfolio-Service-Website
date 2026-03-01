import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';

const QUERY_KEYS = {
  reviews: ['reviews'],
  myReviews: ['reviews', 'my'],
  adminReviews: ['reviews', 'admin'],
  byService: (serviceId) => ['reviews', 'service', serviceId],
};

const invalidateAll = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myReviews });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminReviews });
};

export function useReviews(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.reviews, params],
    queryFn: () => reviewService.getAll(params).then((res) => res.data),
  });
}

export function useMyReviews(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.myReviews, params],
    queryFn: () => reviewService.getMyReviews(params).then((res) => res.data),
  });
}

export function useAdminReviews(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.adminReviews, params],
    queryFn: () => reviewService.getAdminAll(params).then((res) => res.data),
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
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => reviewService.update(id, data).then((res) => res.data),
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => reviewService.delete(id).then((res) => res.data),
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useAdminUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => reviewService.adminUpdate(id, data).then((res) => res.data),
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useAdminDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => reviewService.adminDelete(id).then((res) => res.data),
    onSuccess: () => invalidateAll(queryClient),
  });
}

export function useToggleReviewVisibility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => reviewService.toggleVisibility(id).then((res) => res.data),
    onSuccess: () => invalidateAll(queryClient),
  });
}
