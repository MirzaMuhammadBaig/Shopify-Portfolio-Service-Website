import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services/payment.service';

const QUERY_KEYS = {
  methods: ['payments', 'methods'],
  payments: ['payments'],
  byOrder: (orderId) => ['payments', 'order', orderId],
};

export function usePaymentMethods() {
  return useQuery({
    queryKey: QUERY_KEYS.methods,
    queryFn: () => paymentService.getMethods().then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePaymentByOrder(orderId) {
  return useQuery({
    queryKey: QUERY_KEYS.byOrder(orderId),
    queryFn: () => paymentService.getByOrderId(orderId).then((res) => res.data),
    enabled: !!orderId,
  });
}

export function useCreateManualPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => paymentService.createManualPayment(data).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.byOrder(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useCreateSafepaySession() {
  return useMutation({
    mutationFn: (data) => paymentService.createSafepaySession(data).then((res) => res.data),
  });
}

export function usePayments(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.payments, params],
    queryFn: () => paymentService.getAll(params).then((res) => res.data),
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => paymentService.verify(id, data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.payments }),
  });
}
