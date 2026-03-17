import api from './api';

export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    api.post('/auth/admin/login', { email, password }),

  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getAnalytics: (period?: string) => api.get('/admin/dashboard/analytics', { params: { period } }),

  // Products
  createProduct: (data: any) => api.post('/products', data),
  updateProduct: (id: string, data: any) => api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  uploadProductImages: (id: string, files: FormData) =>
    api.post(`/products/${id}/images`, files, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Categories
  createCategory: (data: any) => api.post('/categories', data),
  updateCategory: (id: string, data: any) => api.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),

  // Orders
  getOrders: (params?: any) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id: string, status: string) =>
    api.put(`/admin/orders/${id}/status`, { status }),

  // Customers
  getCustomers: (params?: any) => api.get('/admin/customers', { params }),

  // Inventory
  getInventoryStatus: () => api.get('/admin/inventory'),

  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settings: Record<string, string>) =>
    api.put('/admin/settings', { settings }),

  // Shipping Zones
  getShippingZones: () => api.get('/admin/shipping-zones'),
  createShippingZone: (data: any) => api.post('/admin/shipping-zones', data),
  updateShippingZone: (id: string, data: any) => api.put(`/admin/shipping-zones/${id}`, data),
  deleteShippingZone: (id: string) => api.delete(`/admin/shipping-zones/${id}`),
};
