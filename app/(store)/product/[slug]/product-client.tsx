'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { getProductName, getProductDescription, getProductPrice, formatCurrency, getCategoryName } from '@/utils/helpers';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButtons from '@/components/ShareButtons';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface ProductPageClientProps {
  product: Product;
}

const ProductPageClient: React.FC<ProductPageClientProps> = ({ product }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const productName = getProductName(product, language);
  const productDescription = getProductDescription(product, language);
  const price = getProductPrice(product, currency);
  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const productImage = product.image_urls?.[0] || '';

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/cart');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleIncrement = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_en,
    description: product.description_en,
    image: productImage ? [productImage] : [],
    brand: {
      '@type': 'Brand',
      name: 'Imisioluwa',
    },
    sku: product.id,
    url: productUrl,
    offers: {
      '@type': 'Offer',
      price: price ?? product.price,
      priceCurrency: currency,
      availability: product.stock_quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: 'Imisioluwa',
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: t('home', 'Home'), href: '/' },
          ...(product.category
            ? [{ label: getCategoryName(product.category, language), href: `/category/${product.category.slug}` }]
            : []),
          { label: productName },
        ]}
      />

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-brand-50">
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                className="w-full h-60 sm:h-80 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-60 sm:h-80 md:h-full flex items-center justify-center text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <h1 className="font-serif text-2xl sm:text-3xl text-brand-dark mb-3 sm:mb-4">{productName}</h1>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 leading-relaxed">{productDescription}</p>

            <div className="font-serif text-2xl sm:text-3xl text-brand-dark mb-6 sm:mb-8">
              {price !== null ? formatCurrency(price, currency) : t('not_available_in_currency')}
            </div>

            {price !== null && (
              <>
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-label text-brand-dark mb-3 sm:mb-4">{t('how_many_add')}</h3>
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
                        if (val > 0 && val <= product.stock_quantity) {
                          setQuantity(val);
                        }
                      }}
                      className="w-16 h-10 text-center border border-border rounded-lg text-lg font-semibold focus:ring-2 focus:ring-brand-light focus:border-transparent"
                      min="1"
                      max={product.stock_quantity}
                    />
                    <button
                      onClick={handleIncrement}
                      className="w-10 h-10 border border-border hover:border-brand-300 rounded-lg text-lg font-medium transition-colors disabled:opacity-30"
                      disabled={quantity >= product.stock_quantity}
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-400">
                      ({product.stock_quantity} {t('in_stock')})
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-6 sm:mb-8">
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3 sm:py-4 bg-brand hover:bg-brand-light text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
                  >
                    {t('buy_this')}
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 sm:py-4 border border-border hover:border-brand-300 text-brand-dark rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
                  >
                    {t('add_to_cart')}
                  </button>
                </div>
              </>
            )}

            <div className="pt-6 border-t border-border">
              <ShareButtons url={productUrl} title={productName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageClient;
