'use client';

import React from 'react';
import { CartItem as CartItemType } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { getProductName, getProductPrice, formatCurrency } from '@/utils/helpers';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const { updateQuantity, removeFromCart } = useCart();
  const productName = getProductName(item.product, language);
  const price = getProductPrice(item.product, currency) || 0;

  const handleIncrement = () => {
    if (item.quantity < item.product.stock_quantity) {
      updateQuantity(item.product.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    } else {
      removeFromCart(item.product.id);
    }
  };

  const subtotal = price * item.quantity;

  return (
    <div className="flex gap-4 bg-white p-4 rounded-xl border border-border">
      <div className="w-24 h-24 bg-brand-50 rounded-lg overflow-hidden flex-shrink-0">
        {item.product.image_urls && item.product.image_urls.length > 0 ? (
          <img
            src={item.product.image_urls[0]}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No Image
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-brand-dark text-sm uppercase tracking-label mb-1">{productName}</h3>
        <p className="text-brand font-semibold mb-3">
          {formatCurrency(price, currency)}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            className="w-8 h-8 border border-border hover:border-brand-300 rounded text-sm font-medium transition-colors"
          >
            -
          </button>
          <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
          <button
            onClick={handleIncrement}
            className="w-8 h-8 border border-border hover:border-brand-300 rounded text-sm font-medium transition-colors"
            disabled={item.quantity >= item.product.stock_quantity}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeFromCart(item.product.id)}
          className="text-danger hover:text-red-700 font-medium text-xs uppercase tracking-label transition-colors"
        >
          {t('remove')}
        </button>
        <p className="text-lg font-bold text-brand-dark">{formatCurrency(subtotal, currency)}</p>
      </div>
    </div>
  );
};

export default CartItem;
