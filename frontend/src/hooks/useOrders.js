import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

const QUERY_KEYS = {
  orders: ['orders'],
  myOrders: ['orders', 'my'],
  detail: (id) => ['orders', id],
};

export function useOrders(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.orders, params],
    queryFn: () => orderService.getAll(params).then((res) => res.data),
  });
}

export function useMyOrders(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.myOrders, params],
    queryFn: () => orderService.getMyOrders(params).then((res) => res.data),
  });
}

export function useOrderById(id) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => orderService.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => orderService.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myOrders });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => orderService.updateStatus(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myOrders });
    },
  });
}

const invalidateAll = (qc) => {
  qc.invalidateQueries({ queryKey: QUERY_KEYS.orders });
  qc.invalidateQueries({ queryKey: QUERY_KEYS.myOrders });
};

export function useSubmitDeliverables() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => orderService.submitDeliverables(id, formData).then((res) => res.data),
    onSuccess: (_, { id }) => {
      invalidateAll(queryClient);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(id) });
    },
  });
}

export function useApproveOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => orderService.approveOrder(id).then((res) => res.data),
    onSuccess: (_, id) => {
      invalidateAll(queryClient);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(id) });
    },
  });
}

export function useRequestRevision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => orderService.requestRevision(id).then((res) => res.data),
    onSuccess: (_, id) => {
      invalidateAll(queryClient);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(id) });
    },
  });
}

export function useOrderMessages(id) {
  return useQuery({
    queryKey: ['orderMessages', id],
    queryFn: () => orderService.getMessages(id).then((res) => res.data),
    enabled: !!id,
  });
}
