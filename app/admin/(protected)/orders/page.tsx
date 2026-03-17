'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/admin';
import { Order } from '@/types';
import { formatCurrency } from '@/utils/helpers';
import { formatDate } from '@/utils/admin-helpers';
import { Spinner, Badge, CustomSelect } from '@/components/ui';
import { useToast } from '@/context/ToastContext';

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  // SSE real-time updates
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const eventSource = new EventSource(`${apiUrl}/admin/orders/stream?token=${token}`);

    eventSource.addEventListener('new_order', () => {
      loadOrders();
    });

    eventSource.addEventListener('payment_confirmed', () => {
      loadOrders();
    });

    eventSource.addEventListener('order_cancelled', () => {
      loadOrders();
    });

    return () => eventSource.close();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await adminApi.getOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spinner size="lg" className="text-brand mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-dark mb-8">Orders</h1>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-label">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-label">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-label">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-label">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-label">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-label">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-label">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-label">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                <tr className="hover:bg-brand-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-brand-dark">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-brand-dark">{order.customer_name}</div>
                    <div className="text-xs text-gray-400">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-brand-dark">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={order.payment_status === 'PAID' ? 'green' : order.payment_status === 'FAILED' ? 'red' : 'yellow'}>
                      {order.payment_status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-brand-dark capitalize">
                    {order.payment_method === 'cod' ? 'COD' : 'Online'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      {updatingOrderId === order.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded z-10">
                          <Spinner size="sm" className="text-brand" />
                        </div>
                      )}
                      <CustomSelect
                        value={order.status}
                        onChange={(val) => updateStatus(order.id, val)}
                        options={[
                          { value: 'PENDING_PAYMENT', label: 'Pending Payment' },
                          { value: 'CONFIRMED', label: 'Confirmed' },
                          { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
                          { value: 'DELIVERED', label: 'Delivered' },
                          { value: 'CANCELLED', label: 'Cancelled' },
                        ]}
                        variant="form"
                        size="sm"
                        menuStrategy="fixed"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="text-brand hover:text-brand-light font-medium text-sm transition-colors"
                    >
                      {expandedOrderId === order.id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 bg-brand-50/30">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-xs uppercase tracking-label text-gray-400 block mb-1">Email</span>
                          <span className="text-brand-dark">{order.customer_email}</span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-label text-gray-400 block mb-1">Phone</span>
                          <span className="text-brand-dark">{order.phone}</span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-label text-gray-400 block mb-1">Address</span>
                          <span className="text-brand-dark">{order.delivery_address}</span>
                        </div>
                        {order.items && order.items.length > 0 && (
                          <div className="col-span-2 md:col-span-3">
                            <span className="text-xs uppercase tracking-label text-gray-400 block mb-2">Items</span>
                            <div className="space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-brand-dark">
                                  <span>{item.product?.name_en || 'Product'} x{item.quantity}</span>
                                  <span>{formatCurrency(item.subtotal)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-brand-dark">{order.order_number}</span>
              <span className="text-xs text-gray-400">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-medium text-brand-dark">{order.customer_name}</span>
              <span className="text-xs text-gray-400">{order.phone}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium text-brand-dark">{formatCurrency(order.total_amount)}</span>
              <Badge color={order.payment_status === 'PAID' ? 'green' : order.payment_status === 'FAILED' ? 'red' : 'yellow'}>
                {order.payment_status}
              </Badge>
              <span className="text-xs text-gray-500 capitalize">
                {order.payment_method === 'cod' ? 'COD' : 'Online'}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
              <div className="flex-1 relative">
                {updatingOrderId === order.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded z-10">
                    <Spinner size="sm" className="text-brand" />
                  </div>
                )}
                <CustomSelect
                  value={order.status}
                  onChange={(val) => updateStatus(order.id, val)}
                  options={[
                    { value: 'PENDING_PAYMENT', label: 'Pending Payment' },
                    { value: 'CONFIRMED', label: 'Confirmed' },
                    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
                    { value: 'DELIVERED', label: 'Delivered' },
                    { value: 'CANCELLED', label: 'Cancelled' },
                  ]}
                  variant="form"
                  size="sm"
                  menuStrategy="fixed"
                />
              </div>
              <button
                onClick={() => toggleOrderDetails(order.id)}
                className="text-brand hover:text-brand-light font-medium text-sm transition-colors"
              >
                {expandedOrderId === order.id ? 'Hide' : 'View'}
              </button>
            </div>
            {expandedOrderId === order.id && (
              <div className="mt-3 pt-3 border-t border-border space-y-2 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-label text-gray-400">Email: </span>
                  <span className="text-brand-dark">{order.customer_email}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-label text-gray-400">Address: </span>
                  <span className="text-brand-dark">{order.delivery_address}</span>
                </div>
                {order.items && order.items.length > 0 && (
                  <div>
                    <span className="text-xs uppercase tracking-label text-gray-400 block mb-1">Items:</span>
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-brand-dark">
                        <span>{item.product_name || item.product?.name_en} x{item.quantity}</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
