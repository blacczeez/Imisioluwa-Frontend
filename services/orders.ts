import api from './api';
import { Order } from '@/types';

interface CreateOrderData {
  customer_name: string;
  customer_email: string;
  phone: string;
  delivery_address: string;
  notes?: string;
  payment_method: 'online' | 'cod';
  currency?: string;
  country?: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
  }[];
}

export const orderService = {
  create: async (orderData: CreateOrderData) => {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },

  track: async (orderNumber: string, phone: string) => {
    const response = await api.get<Order>('/orders/track', {
      params: { orderNumber, phone },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  getPaymentMethods: async () => {
    const response = await api.get<{ online: boolean; cod: boolean }>('/settings/payment-methods');
    return response.data;
  },

  getShippingRate: async (country: string) => {
    const response = await api.get('/shipping/rate', { params: { country } });
    return response.data;
  },
};
