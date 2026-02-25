import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { faqService } from '../services/faq.service';

const QUERY_KEYS = {
  faqs: ['faqs'],
};

export function useFaqs(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.faqs, params],
    queryFn: () => faqService.getAll(params).then((res) => res.data),
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => faqService.create(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.faqs }),
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => faqService.update(id, data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.faqs }),
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => faqService.delete(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.faqs }),
  });
}
