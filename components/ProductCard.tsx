'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import { getProductName, getProductPrice, formatCurrency } from '@/utils/helpers';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const productName = getProductName(product, language);
  const price = getProductPrice(product, currency);

  if (price === null) return null;

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={() => onClick(product)}
      className="group border border-border rounded-xl overflow-hidden cursor-pointer bg-white hover:border-brand-300 transition-colors duration-200 block"
    >
      <div className="relative h-48 sm:h-64 bg-brand-50">
        {product.image_urls && product.image_urls.length > 0 ? (
          <img
            src={product.image_urls[0]}
            alt={productName}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-medium text-sm uppercase tracking-label">{t('out_of_stock')}</span>
          </div>
        )}
        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <div className="absolute top-3 right-3">
            <span className="bg-white text-brand-dark text-xs font-medium px-2.5 py-1 rounded-full border border-border">
              Few left
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex justify-between items-end">
        <div>
          <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-label mb-1 line-clamp-2">
            {productName}
          </h3>
          {product.stock_quantity > 0 && (
            <span className="text-xs text-success font-medium">{t('in_stock')}</span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold text-brand-dark">
            {formatCurrency(price, currency)}
          </span>
          <span className="text-brand-light group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 text-lg">
            &#8599;
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
