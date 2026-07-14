'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Package } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import {
  formatCurrency,
  getPackageDescription,
  getPackageName,
  getPackageProblem,
  getProductName,
} from '@/utils/helpers';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useToast } from '@/context/ToastContext';

interface PackagePageClientProps {
  pkg: Package;
}

const PackagePageClient: React.FC<PackagePageClientProps> = ({ pkg }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const { addPackageToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const name = getPackageName(pkg, language);
  const description = getPackageDescription(pkg, language);
  const problem = getPackageProblem(pkg, language);
  const maxQty = pkg.max_quantity ?? 0;
  const canPurchase = pkg.in_stock && maxQty > 0 && currency === 'NGN';

  const handleAddToCart = () => {
    if (currency !== 'NGN') {
      showToast(t('packages_ngn_only', 'Packages are only available in Naira (NGN)'));
      return;
    }
    addPackageToCart(pkg, quantity);
    showToast(t('added_to_cart', 'Added to cart'));
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: t('home', 'Home'), href: '/' },
          { label: name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div className="relative aspect-square bg-brand-50 rounded-xl overflow-hidden border border-border">
          {pkg.image_url ? (
            <Image src={pkg.image_url} alt={name} fill className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">No Image</div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-label text-brand mb-2">{t('package', 'Package')}</p>
          <h1 className="font-serif text-3xl text-brand-dark mb-4">{name}</h1>

          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6">
            <p className="text-xs uppercase tracking-label text-brand mb-2">{t('solves', 'Solves')}</p>
            <p className="text-brand-dark">{problem}</p>
          </div>

          <p className="text-3xl font-bold text-brand mb-6">{formatCurrency(pkg.price, 'NGN')}</p>
          <p className="text-gray-600 mb-8 whitespace-pre-line">{description}</p>

          <div className="mb-8">
            <h2 className="font-serif text-xl text-brand-dark mb-4">{t('whats_included', "What's Included")}</h2>
            <div className="space-y-3">
              {pkg.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-white border border-border rounded-lg p-3">
                  <div className="relative w-14 h-14 rounded-md overflow-hidden bg-brand-50 flex-shrink-0">
                    {item.variant.product.image_urls?.[0] ? (
                      <Image
                        src={item.variant.product.image_urls[0]}
                        alt={getProductName(item.variant.product, language)}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/product/${item.variant.product.slug}`}
                      className="font-medium text-brand-dark hover:text-brand text-sm"
                    >
                      {getProductName(item.variant.product, language)}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {item.variant.weight_ml}ml &times; {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {currency !== 'NGN' && (
            <p className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              {t('packages_ngn_only', 'Packages are only available in Naira (NGN). Switch currency to purchase.')}
            </p>
          )}

                          {!pkg.in_stock && (
                            <p className="text-sm text-danger mb-4">{t('out_of_stock', 'Out of Stock')}</p>
                          )}

                          {pkg.items.some((item) => item.variant.stock_quantity < item.quantity) && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-danger space-y-1">
                              <p className="font-medium">Unavailable items in this package:</p>
                              {pkg.items
                                .filter((item) => item.variant.stock_quantity < item.quantity)
                                .map((item) => (
                                  <p key={item.id}>
                                    {getProductName(item.variant.product, language)} ({item.variant.weight_ml}ml):
                                    needs {item.quantity}, has {item.variant.stock_quantity}
                                  </p>
                                ))}
                            </div>
                          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="px-4 py-3 hover:bg-brand-50"
                disabled={!canPurchase}
              >
                -
              </button>
              <span className="px-4 py-3 font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(maxQty, value + 1))}
                className="px-4 py-3 hover:bg-brand-50"
                disabled={!canPurchase || quantity >= maxQty}
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canPurchase}
              className="flex-1 py-3 bg-brand hover:bg-brand-light disabled:opacity-50 text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
            >
              {t('add_to_cart')}
            </button>

            <button
              type="button"
              onClick={() => {
                handleAddToCart();
                router.push('/cart');
              }}
              disabled={!canPurchase}
              className="flex-1 py-3 border border-brand text-brand hover:bg-brand-50 disabled:opacity-50 rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
            >
              {t('buy_now', 'Buy Now')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagePageClient;
