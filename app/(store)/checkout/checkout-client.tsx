'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { orderService } from '@/services/orders';
import { paymentService } from '@/services/payments';
import { formatCurrency, getProductName, getProductPrice } from '@/utils/helpers';
import { Spinner } from '@/components/ui';
import { useToast } from '@/context/ToastContext';

interface CheckoutFormData {
  customer_name: string;
  customer_email: string;
  phone: string;
  delivery_address: string;
  notes?: string;
  payment_method: 'online' | 'cod';
}

interface ShippingRate {
  available: boolean;
  zone?: string;
  currency?: string;
  flatRate?: number;
  freeShippingAbove?: number;
  message?: string;
}

export default function CheckoutClient() {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { currency, country } = useCurrency();
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  /** Prevents empty-cart → home redirect after COD clears cart but before client navigation finishes. */
  const orderPlacedLeavingCheckout = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<{ online: boolean; cod: boolean }>({ online: true, cod: true });
  const [shippingRate, setShippingRate] = useState<ShippingRate | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>();

  useEffect(() => {
    orderService.getPaymentMethods().then(setPaymentMethods).catch(console.error);
  }, []);

  useEffect(() => {
    if (country) {
      setLoadingShipping(true);
      orderService.getShippingRate(country)
        .then(setShippingRate)
        .catch(() => setShippingRate(null))
        .finally(() => setLoadingShipping(false));
    }
  }, [country]);

  if (cart.length === 0 && !orderPlacedLeavingCheckout.current) {
    router.push('/');
    return null;
  }

  const itemsTotal = getCartTotal(currency);
  const shippingCost = shippingRate?.available && shippingRate.flatRate
    ? (shippingRate.freeShippingAbove && itemsTotal >= shippingRate.freeShippingAbove ? 0 : shippingRate.flatRate)
    : 0;
  const orderTotal = itemsTotal + shippingCost;

  const codAvailable = paymentMethods.cod && currency === 'NGN';

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true);

      const orderData = {
        ...data,
        currency,
        country,
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: getProductPrice(item.product, currency) || 0,
        })),
      };

      const order = await orderService.create(orderData);

      if (data.payment_method === 'online') {
        const paymentData = await paymentService.initialize(
          order.id,
          data.customer_email,
          orderTotal
        );

        orderPlacedLeavingCheckout.current = true;
        clearCart();

        if (paymentData.gateway === 'stripe' && paymentData.url) {
          window.location.href = paymentData.url;
        } else if (paymentData.authorization_url) {
          window.location.href = paymentData.authorization_url;
        }
      } else {
        orderPlacedLeavingCheckout.current = true;
        clearCart();
        router.push(`/order-confirmation?order=${order.id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      showToast(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = "w-full px-3 py-2.5 sm:px-4 sm:py-3 text-base border border-border rounded-lg focus:ring-2 focus:ring-brand-light focus:border-transparent transition-colors bg-white text-brand-dark";
  const labelClassName = "block text-sm font-semibold text-brand-dark uppercase tracking-label mb-2";
  const errorClassName = "mt-1.5 text-sm text-danger";

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-brand-dark mb-5 sm:mb-8">{t('customer_info')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 sm:p-6 md:p-8 rounded-xl border border-border">
            <div className="space-y-5">
              <div>
                <label className={labelClassName}>{t('full_name')} *</label>
                <input {...register('customer_name', { required: t('required_field') })} className={inputClassName} />
                {errors.customer_name && <p className={errorClassName}>{errors.customer_name.message}</p>}
              </div>

              <div>
                <label className={labelClassName}>{t('email')} *</label>
                <input
                  type="email"
                  {...register('customer_email', {
                    required: t('required_field'),
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: t('invalid_email') },
                  })}
                  className={inputClassName}
                />
                {errors.customer_email && <p className={errorClassName}>{errors.customer_email.message}</p>}
              </div>

              <div>
                <label className={labelClassName}>{t('phone_number')} *</label>
                <input
                  type="tel"
                  {...register('phone', {
                    required: t('required_field'),
                    pattern: { value: /^[0-9]{10,15}$/, message: t('invalid_phone') },
                  })}
                  className={inputClassName}
                />
                {errors.phone && <p className={errorClassName}>{errors.phone.message}</p>}
              </div>

              <div>
                <label className={labelClassName}>{t('delivery_address')} *</label>
                <textarea {...register('delivery_address', { required: t('required_field') })} rows={3} className={inputClassName} />
                {errors.delivery_address && <p className={errorClassName}>{errors.delivery_address.message}</p>}
              </div>

              <div>
                <label className={labelClassName}>Notes (Optional)</label>
                <textarea {...register('notes')} rows={2} className={inputClassName} />
              </div>

              <div>
                <label className={labelClassName}>{t('payment_method')} *</label>
                <div className="space-y-3">
                  {paymentMethods.online && (
                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-brand transition-colors">
                      <input type="radio" value="online" {...register('payment_method', { required: t('required_field') })} className="w-4 h-4 text-brand" />
                      <div>
                        <p className="font-medium text-brand-dark">{t('pay_online')}</p>
                        <p className="text-sm text-gray-400">{t('pay_online_desc')}</p>
                      </div>
                    </label>
                  )}
                  {codAvailable && (
                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-brand transition-colors">
                      <input type="radio" value="cod" {...register('payment_method', { required: t('required_field') })} className="w-4 h-4 text-brand" />
                      <div>
                        <p className="font-medium text-brand-dark">{t('pay_on_delivery')}</p>
                        <p className="text-sm text-gray-400">{t('pay_on_delivery_desc')}</p>
                      </div>
                    </label>
                  )}
                </div>
                {errors.payment_method && <p className={errorClassName}>{errors.payment_method.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 sm:mt-8 py-3 sm:py-4 bg-brand hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (<><Spinner size="sm" className="text-white" />{t('loading')}</>) : t('place_order')}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-border sticky top-16 sm:top-24">
            <h2 className="font-serif text-xl text-brand-dark mb-6">{t('order_summary')}</h2>

            <div className="space-y-3 mb-4">
              {cart.map((item) => {
                const price = getProductPrice(item.product, currency) || 0;
                return (
                  <div key={item.product.id} className="flex justify-between text-sm gap-4">
                    <span className="text-gray-500 flex-1">
                      {getProductName(item.product, language)} <span className="text-brand-300">&times; {item.quantity}</span>
                    </span>
                    <span className="font-medium text-brand-dark whitespace-nowrap">
                      {formatCurrency(price * item.quantity, currency)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="h-px bg-border my-4"></div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('items_total')}</span>
                <span className="font-medium text-brand-dark">{formatCurrency(itemsTotal, currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('shipping_cost')}</span>
                <span className="font-medium text-brand-dark">
                  {loadingShipping ? '...' : shippingCost === 0 ? t('free_shipping') : formatCurrency(shippingCost, currency)}
                </span>
              </div>
            </div>

            <div className="h-px bg-border my-4"></div>
            <div className="flex justify-between">
              <span className="font-semibold text-brand-dark">{t('order_total')}</span>
              <span className="text-xl font-bold text-brand-dark">{formatCurrency(orderTotal, currency)}</span>
            </div>

            {shippingRate && !shippingRate.available && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                {t('we_dont_ship_there')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
