'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/admin';
import { formatCurrency } from '@/utils/helpers';
import { formatDate } from '@/utils/admin-helpers';
import { Spinner, Badge } from '@/components/ui';

interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  lowStockProducts: number;
  recentOrders: any[];
}

const StatCard: React.FC<{ label: string; value: string | number; color?: string }> = ({ label, value, color = 'text-brand-dark' }) => (
  <div className="bg-white p-6 rounded-xl border border-border">
    <h3 className="text-xs font-semibold uppercase tracking-label text-gray-400 mb-2">{label}</h3>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spinner size="lg" className="text-brand mx-auto" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Error loading dashboard</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-dark mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Today's Orders" value={stats.todayOrders} color="text-brand" />
        <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} color="text-success" />
        <StatCard label="Low Stock Items" value={stats.lowStockProducts} color="text-danger" />
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-serif text-xl text-brand-dark">Recent Orders</h2>
        </div>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-label">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-brand-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-brand-dark">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.customer_name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-brand-dark">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge color="brand">{order.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border">
          {stats.recentOrders.map((order: any) => (
            <div key={order.id} className="px-4 py-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-brand-dark">{order.order_number}</span>
                <Badge color="brand">{order.status}</Badge>
              </div>
              <div className="text-sm text-gray-500">{order.customer_name}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-brand-dark">{formatCurrency(order.total_amount)}</span>
                <span className="text-xs text-gray-400">{formatDate(order.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
