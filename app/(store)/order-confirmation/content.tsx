'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Order, Currency } from '@/types';
import { orderService } from '@/services/orders';
import { paymentService } from '@/services/payments';
import { formatCurrency } from '@/utils/helpers';
import { Spinner } from '@/components/ui';

export default function OrderConfirmationContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchParams) {
      router.push('/');
      return;
    }

    const orderId = searchParams.get('order');
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    const sessionId = searchParams.get('session_id');

    if (orderId) {
      if (reference) {
        verifyPaystackAndLoad(orderId, reference);
      } else if (sessionId) {
        verifyStripeAndLoad(orderId, sessionId);
      } else {
        loadOrder(orderId);
      }
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  const verifyPaystackAndLoad = async (orderId: string, reference: string) => {
    try {
      await paymentService.verifyPaystack(reference);
    } catch (error) {
      console.error('Paystack verification error:', error);
    }
    loadOrder(orderId);
  };

  const verifyStripeAndLoad = async (orderId: string, sessionId: string) => {
    try {
      await paymentService.verifyStripe(sessionId);
    } catch (error) {
      console.error('Stripe verification error:', error);
    }
    loadOrder(orderId);
  };

  const loadOrder = async (orderId: string) => {
    try {
      const orderData = await orderService.getById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spinner size="lg" className="text-brand mx-auto" />
        <p className="mt-4 text-gray-400 text-sm">{t('loading')}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-6">{t('error')}</p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-brand hover:bg-brand-light text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
        >
          {t('home')}
        </button>
      </div>
    );
  }

  const orderCurrency = (order.currency as Currency) || 'NGN';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-5 sm:p-8 md:p-10 rounded-xl border border-border text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-brand-dark mb-2">{t('order_placed')}</h1>

        <div className="bg-brand-50 p-6 rounded-xl my-8">
          <p className="text-xs font-semibold uppercase tracking-label text-gray-400 mb-2">{t('order_number')}</p>
          <p className="text-2xl font-bold text-brand-dark">{order.order_number}</p>
        </div>

        <div className="text-left mb-8 space-y-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500">{t('order_status')}:</span>
            <span className="text-sm font-semibold text-brand-dark capitalize">{t(order.status)}</span>
          </div>
          <div className="h-px bg-border"></div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500">Payment:</span>
            <span className="text-sm font-semibold text-brand-dark capitalize">{t(`payment_${order.payment_status}`)}</span>
          </div>
          {order.payment_method === 'cod' && (
            <>
              <div className="h-px bg-border"></div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">{t('payment_method')}:</span>
                <span className="text-sm font-semibold text-brand-dark">{t('pay_on_delivery')}</span>
              </div>
            </>
          )}
          {order.shipping_cost && order.shipping_cost > 0 && (
            <>
              <div className="h-px bg-border"></div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">{t('shipping_cost')}:</span>
                <span className="text-sm font-semibold text-brand-dark">{formatCurrency(order.shipping_cost, orderCurrency)}</span>
              </div>
            </>
          )}
          <div className="h-px bg-border"></div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500">{t('total')}:</span>
            <span className="text-lg font-bold text-brand-dark">{formatCurrency(order.total_amount, orderCurrency)}</span>
          </div>
        </div>

        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-8">
          <p className="text-sm text-brand">{t('track_order_desc')}</p>
        </div>

        <div className="space-y-3">
          <Link
            href={`/track-order?orderNumber=${encodeURIComponent(order.order_number)}&phone=${encodeURIComponent(order.phone)}`}
            className="block w-full py-3 sm:py-4 bg-brand hover:bg-brand-light text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors text-center"
          >
            {t('track_order')}
          </Link>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 sm:py-4 border border-border text-brand-dark hover:bg-brand-50 rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
          >
            {t('continue_shopping')}
          </button>
        </div>
      </div>
    </div>
  );
}
