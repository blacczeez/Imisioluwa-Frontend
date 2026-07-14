import api from './api';
import { Package } from '@/types';

export const packageService = {
  getAll: async (params?: { promoted?: boolean; include_inactive?: boolean }) => {
    const response = await api.get<Package[]>('/packages', { params });
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<Package>(`/packages/slug/${slug}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Package>(`/packages/${id}`);
    return response.data;
  },
};
