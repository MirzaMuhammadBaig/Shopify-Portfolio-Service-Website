import api from './api';
import { API_ENDPOINTS } from '../constants';

export const paymentService = {
  getMethods: () => api.get(API_ENDPOINTS.PAYMENTS.METHODS),
  createManualPayment: (data) => {
    const formData = new FormData();
    formData.append('orderId', data.orderId);
    formData.append('method', data.method);
    formData.append('transactionId', data.transactionId);
    if (data.screenshot) formData.append('image', data.screenshot);
    return api.post(API_ENDPOINTS.PAYMENTS.MANUAL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  createStripeSession: (data) => api.post(API_ENDPOINTS.PAYMENTS.STRIPE_SESSION, data),
  getByOrderId: (orderId) => api.get(API_ENDPOINTS.PAYMENTS.BY_ORDER(orderId)),
  getAll: (params) => api.get(API_ENDPOINTS.PAYMENTS.BASE, { params }),
  verify: (id, data) => api.patch(API_ENDPOINTS.PAYMENTS.VERIFY(id), data),
};
