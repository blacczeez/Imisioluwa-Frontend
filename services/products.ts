import api from './api';
import { Product, Category } from '@/types';

export const productService = {
  getAll: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    include_out_of_stock?: boolean;
    include_inactive?: boolean;
  }) => {
    const response = await api.get<{ products: Product[]; total: number }>('/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<Product>(`/products/slug/${slug}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  getCategoryBySlug: async (slug: string) => {
    const response = await api.get<Category & { products: Product[] }>(`/categories/${slug}`);
    return response.data;
  },
};
