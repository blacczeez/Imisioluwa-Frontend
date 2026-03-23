'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import CartItem from '@/components/CartItem';
import { formatCurrency } from '@/utils/helpers';

export default function CartClient() {
  const { t } = useTranslation();
  const router = useRouter();
  const { cart, getCartTotal } = useCart();
  const { currency } = useCurrency();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-50 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-brand-dark mb-2">{t('empty_cart')}</h2>
        <p className="text-gray-400 mb-8">{t('empty_cart_message')}</p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-brand hover:bg-brand-light text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
        >
          {t('continue_shopping')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-brand-dark mb-5 sm:mb-8">{t('your_cart')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-border sticky top-16 sm:top-24">
            <h2 className="font-serif text-xl text-brand-dark mb-6">{t('order_summary')}</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>{t('subtotal')}</span>
                <span className="font-medium text-brand-dark">{formatCurrency(getCartTotal(currency), currency)}</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex justify-between pt-1">
                <span className="font-semibold text-brand-dark">{t('total')}</span>
                <span className="text-xl font-bold text-brand-dark">{formatCurrency(getCartTotal(currency), currency)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3 sm:py-4 bg-brand hover:bg-brand-light text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
            >
              {t('proceed_to_order')}
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full mt-3 py-3 sm:py-4 border border-border hover:border-brand-300 text-brand-dark rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
            >
              {t('continue_shopping')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
