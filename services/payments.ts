import api from './api';
import { PaymentInitResponse } from '@/types';

export const paymentService = {
  initialize: async (orderId: string, email: string, amount: number) => {
    const response = await api.post<PaymentInitResponse>('/payments/initialize', {
      orderId,
      email,
      amount,
    });
    return response.data;
  },

  verifyPaystack: async (reference: string) => {
    const response = await api.post('/payments/verify/paystack', { reference });
    return response.data;
  },

  verifyStripe: async (sessionId: string) => {
    const response = await api.post('/payments/verify/stripe', { sessionId });
    return response.data;
  },
};
