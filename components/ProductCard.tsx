'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import { getProductName, getProductPrice, formatCurrency, getActiveVariants, getCheapestVariant, getVariantPrice } from '@/utils/helpers';

interface ProductCardProps {
  product: Product;
}

const productHref = (product: Product) => {
  const slug = product.slug?.trim();
  return `/product/${slug && slug.length > 0 ? slug : product.id}`;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const productName = getProductName(product, language);
  const activeVariants = getActiveVariants(product);
  const cheapestVariant = getCheapestVariant(product, currency);
  const price = cheapestVariant ? getVariantPrice(cheapestVariant, currency) : getProductPrice(product, currency);
  const hasWeight = activeVariants.length > 0 || typeof product.weight_kg === 'number';
  const sizeSummary = activeVariants.slice(0, 3).map((variant) => `${variant.weight_ml}ml`).join(', ');
  const totalVariantStock = activeVariants.reduce((sum, variant) => sum + variant.stock_quantity, 0);
  const isOutOfStock = activeVariants.length > 0 ? totalVariantStock <= 0 : product.stock_quantity <= 0;
  const isLowStock = activeVariants.length > 0 ? totalVariantStock > 0 && totalVariantStock <= 5 : product.stock_quantity > 0 && product.stock_quantity <= 5;

  return (
    <Link
      href={productHref(product)}
      className="group border border-border rounded-xl overflow-hidden cursor-pointer bg-white hover:border-brand-300 transition-colors duration-200 block"
    >
      <div className="relative h-36 sm:h-52 md:h-64 bg-brand-50">
        {product.image_urls && product.image_urls.length > 0 ? (
          <Image
            src={product.image_urls[0]}
            alt={productName}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-medium text-sm uppercase tracking-label">{t('out_of_stock')}</span>
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-3 right-3">
            <span className="bg-white text-brand-dark text-xs font-medium px-2.5 py-1 rounded-full border border-border">
              Few left
            </span>
          </div>
        )}
      </div>
      <div className="p-2.5 sm:p-4 flex justify-between items-end gap-1">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs sm:text-sm font-semibold text-brand-dark uppercase tracking-label mb-0.5 sm:mb-1 line-clamp-2 leading-snug">
            {productName}
          </h3>
          {hasWeight && (
            <p className="text-xs text-gray-500 mb-0.5">
              {activeVariants.length > 0
                ? `${sizeSummary}${activeVariants.length > 3 ? ` +${activeVariants.length - 3} more` : ''}`
                : `${product.weight_kg}ml`}
            </p>
          )}
          {!isOutOfStock && (
            <span className="text-xs text-success font-medium">{t('in_stock')}</span>
          )}
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="text-sm sm:text-lg font-bold text-brand-dark tabular-nums">
            {price !== null
              ? (activeVariants.length > 0 ? `From ${formatCurrency(price, currency)}` : formatCurrency(price, currency))
              : t('not_available_in_currency')}
          </span>
          <span className="text-brand-light group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 text-sm sm:text-lg leading-none" aria-hidden>
            &#8599;
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
