'use client';

import React from 'react';
import Image from 'next/image';
import { CartLine } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { getProductName, getProductPrice, formatCurrency, getVariantPrice, getPackageName } from '@/utils/helpers';

interface CartItemProps {
  item: CartLine;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const { updateQuantity, removeFromCart, getCartLineKey } = useCart();
  const lineKey = getCartLineKey(item);

  if (item.type === 'package') {
    const pkg = item.package;
    const name = getPackageName(pkg, language);
    const price = currency === 'NGN' ? pkg.price : 0;
    const maxQty = pkg.max_quantity ?? 0;

    return (
      <div className="flex gap-4 bg-white p-4 rounded-xl border border-border">
        <div className="relative w-24 h-24 bg-brand-50 rounded-lg overflow-hidden flex-shrink-0">
          {pkg.image_url ? (
            <Image src={pkg.image_url} alt={name} width={96} height={96} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Image</div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-label text-brand mb-1">{t('package', 'Package')}</p>
          <h3 className="font-semibold text-brand-dark text-sm uppercase tracking-label mb-1">{name}</h3>
          <p className="text-xs text-gray-500 mb-2">{pkg.items.length} {t('items_included', 'items included')}</p>
          <p className="text-brand font-semibold mb-3">{formatCurrency(price, currency)}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(lineKey, item.quantity - 1)}
              className="w-8 h-8 border border-border hover:border-brand-300 rounded text-sm font-medium transition-colors"
            >
              -
            </button>
            <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(lineKey, item.quantity + 1)}
              className="w-8 h-8 border border-border hover:border-brand-300 rounded text-sm font-medium transition-colors"
              disabled={item.quantity >= maxQty}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          <button
            onClick={() => removeFromCart(lineKey)}
            className="text-danger hover:text-red-700 font-medium text-xs uppercase tracking-label transition-colors"
          >
            {t('remove')}
          </button>
          <p className="text-lg font-bold text-brand-dark">{formatCurrency(price * item.quantity, currency)}</p>
        </div>
      </div>
    );
  }

  const productName = getProductName(item.product, language);
  const variant = item.product.variants?.find((entry) => entry.id === item.variantId);
  const price = (variant ? getVariantPrice(variant, currency) : getProductPrice(item.product, currency)) || 0;
  const availableStock = variant?.stock_quantity ?? item.product.stock_quantity;

  return (
    <div className="flex gap-4 bg-white p-4 rounded-xl border border-border">
      <div className="relative w-24 h-24 bg-brand-50 rounded-lg overflow-hidden flex-shrink-0">
        {item.product.image_urls && item.product.image_urls.length > 0 ? (
          <Image
            src={item.product.image_urls[0]}
            alt={productName}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Image</div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-brand-dark text-sm uppercase tracking-label mb-1">{productName}</h3>
        {item.variantWeightMl && <p className="text-xs text-gray-500 mb-1">{item.variantWeightMl}ml</p>}
        <p className="text-brand font-semibold mb-3">{formatCurrency(price, currency)}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(lineKey, item.quantity - 1)}
            className="w-8 h-8 border border-border hover:border-brand-300 rounded text-sm font-medium transition-colors"
          >
            -
          </button>
          <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(lineKey, item.quantity + 1)}
            className="w-8 h-8 border border-border hover:border-brand-300 rounded text-sm font-medium transition-colors"
            disabled={item.quantity >= availableStock}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeFromCart(lineKey)}
          className="text-danger hover:text-red-700 font-medium text-xs uppercase tracking-label transition-colors"
        >
          {t('remove')}
        </button>
        <p className="text-lg font-bold text-brand-dark">{formatCurrency(price * item.quantity, currency)}</p>
      </div>
    </div>
  );
};

export default CartItem;
