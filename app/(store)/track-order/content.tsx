'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { Currency, Order } from '@/types';
import { orderService } from '@/services/orders';
import { formatCurrency } from '@/utils/helpers';
import { Spinner } from '@/components/ui';

const TrackOrderContent: React.FC = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams?.get('orderNumber') || '');
  const [phone, setPhone] = useState(searchParams?.get('phone') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!orderNumber.trim() || !phone.trim()) {
      setError(t('track_order_missing_fields'));
      setOrder(null);
      return;
    }

    try {
      setTracking(true);
      setError('');
      const trackedOrder = await orderService.track(orderNumber.trim(), phone.trim());
      setOrder(trackedOrder);
    } catch (err: any) {
      setOrder(null);
      setError(err.response?.data?.error || t('track_order_not_found'));
    } finally {
      setTracking(false);
    }
  };

  useEffect(() => {
    if (searchParams?.get('orderNumber') && searchParams?.get('phone')) {
      void handleTrackOrder();
    }
    // Intentionally run only on first render with initial query params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderCurrency = (order?.currency as Currency) || 'NGN';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="font-serif text-2xl sm:text-4xl text-brand-dark mb-2 sm:mb-3">{t('track_order')}</h1>
        <p className="text-gray-500">{t('track_order_desc')}</p>
      </div>

      <div className="bg-white rounded-xl border border-border p-4 sm:p-6 md:p-8">
        <form onSubmit={handleTrackOrder} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 sm:gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-brand-dark uppercase tracking-label mb-2">
              {t('order_number')}
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder={t('track_order_number_placeholder')}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-base border border-border rounded-lg focus:ring-2 focus:ring-brand-light focus:border-transparent transition-colors bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-dark uppercase tracking-label mb-2">
              {t('phone_number')}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('track_phone_placeholder')}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-base border border-border rounded-lg focus:ring-2 focus:ring-brand-light focus:border-transparent transition-colors bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={tracking}
            className="px-5 py-2.5 sm:px-6 sm:py-3 bg-brand hover:bg-brand-light disabled:opacity-70 text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
          >
            {tracking ? t('loading') : t('track_order')}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {tracking && !order && (
          <div className="text-center py-10">
            <Spinner size="lg" className="text-brand mx-auto" />
          </div>
        )}

        {order && (
          <div className="mt-8">
            <div className="rounded-xl bg-brand-50 border border-brand-100 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-label text-gray-400 mb-2">
                    {t('order_number')}
                  </p>
                  <p className="text-xl font-bold text-brand-dark">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-label text-gray-400 mb-2">
                    {t('order_status')}
                  </p>
                  <p className="text-xl font-bold text-brand-dark">{t(order.status)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-gray-500">{t('payment_status_label')}</span>
                <span className="font-semibold text-brand-dark">{t(`payment_${order.payment_status}`)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-gray-500">{t('order_date')}</span>
                <span className="font-semibold text-brand-dark">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              {order.shipping_cost && order.shipping_cost > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-gray-500">{t('shipping_cost')}</span>
                  <span className="font-semibold text-brand-dark">
                    {formatCurrency(order.shipping_cost, orderCurrency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">{t('total')}</span>
                <span className="text-lg font-bold text-brand-dark">
                  {formatCurrency(order.total_amount, orderCurrency)}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-serif text-2xl text-brand-dark mb-4">{t('order_items')}</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 border border-border rounded-lg px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-brand-dark">{item.product.name_en}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x {formatCurrency(item.unit_price, orderCurrency)}
                      </p>
                    </div>
                    <p className="font-semibold text-brand-dark">
                      {formatCurrency(item.subtotal, orderCurrency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderContent;
