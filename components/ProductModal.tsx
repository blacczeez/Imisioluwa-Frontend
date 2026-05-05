'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { getProductName, getProductDescription, getProductPrice, formatCurrency, getActiveVariants, getCheapestVariant, getVariantPrice } from '@/utils/helpers';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const productName = getProductName(product, language);
  const productDescription = getProductDescription(product, language);
  const activeVariants = getActiveVariants(product);
  const cheapestVariant = getCheapestVariant(product, currency);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(cheapestVariant?.id ?? activeVariants[0]?.id ?? null);
  const selectedVariant = activeVariants.find((variant) => variant.id === selectedVariantId) ?? null;
  const price = selectedVariant ? getVariantPrice(selectedVariant, currency) : getProductPrice(product, currency);
  const availableStock = selectedVariant?.stock_quantity ?? product.stock_quantity;

  if (!isOpen) return null;

  const handleBuyNow = () => {
    if (availableStock <= 0) return;
    addToCart(product, quantity, selectedVariant ?? undefined);
    onClose();
    router.push('/cart');
  };

  const handleContinueShopping = () => {
    if (availableStock <= 0) return;
    addToCart(product, quantity, selectedVariant ?? undefined);
    onClose();
    setQuantity(1);
  };

  const handleIncrement = () => {
    if (quantity < availableStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="font-serif text-2xl text-brand-dark">{productName}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-brand-dark text-2xl transition-colors leading-none"
            >
              &times;
            </button>
          </div>

          <div className="mb-6">
            {product.image_urls && product.image_urls.length > 0 ? (
              <div className="relative w-full h-80 rounded-lg overflow-hidden bg-brand-50">
                <Image
                  src={product.image_urls[0]}
                  alt={productName}
                  fill
                  sizes="(max-width: 672px) 100vw, 672px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-80 bg-brand-50 rounded-lg flex items-center justify-center text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          <p className="text-gray-500 mb-4 leading-relaxed">{productDescription}</p>
          {activeVariants.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeVariants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => {
                    setSelectedVariantId(variant.id);
                    setQuantity(1);
                  }}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                    selectedVariantId === variant.id
                      ? 'border-brand bg-brand text-white'
                      : 'border-border text-brand-dark hover:border-brand-300'
                  }`}
                >
                  {variant.weight_ml}ml
                </button>
              ))}
            </div>
          )}

          <div className="font-serif text-3xl text-brand-dark mb-8">
            {price !== null ? formatCurrency(price, currency) : t('not_available_in_currency')}
          </div>

          {price !== null && (
            <>
              <div className="mb-8">
                <h3 className="text-sm font-semibold uppercase tracking-label text-brand-dark mb-4">{t('how_many_add')}</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleDecrement}
                    className="w-10 h-10 border border-border hover:border-brand-300 rounded-lg text-lg font-medium transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > 0 && val <= availableStock) {
                        setQuantity(val);
                      }
                    }}
                    className="w-16 h-10 text-center border border-border rounded-lg text-lg font-semibold focus:ring-2 focus:ring-brand-light focus:border-transparent"
                    min="1"
                    max={availableStock}
                  />
                  <button
                    onClick={handleIncrement}
                    className="w-10 h-10 border border-border hover:border-brand-300 rounded-lg text-lg font-medium transition-colors disabled:opacity-30"
                    disabled={quantity >= availableStock}
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-400">
                    ({availableStock} {t('in_stock')})
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={availableStock <= 0}
                  className="w-full py-4 bg-brand hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
                >
                  {t('buy_this')}
                </button>
                <button
                  onClick={handleContinueShopping}
                  disabled={availableStock <= 0}
                  className="w-full py-4 border border-border hover:border-brand-300 disabled:opacity-50 disabled:cursor-not-allowed text-brand-dark rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
                >
                  {t('continue_looking')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
