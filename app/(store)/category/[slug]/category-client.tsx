'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import { useLanguage } from '@/context/LanguageContext';
import { getCategoryName } from '@/utils/helpers';
import Breadcrumbs from '@/components/Breadcrumbs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface CategoryPageClientProps {
  category: Category & { products: Product[] };
}

const CategoryPageClient: React.FC<CategoryPageClientProps> = ({ category }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categoryName = getCategoryName(category, language);
  const categoryUrl = `${SITE_URL}/category/${category.slug}`;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: category.name_en,
    url: categoryUrl,
    numberOfItems: category.products.length,
    itemListElement: category.products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/product/${product.slug ?? product.id}`,
      name: product.name_en,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: t('home', 'Home'), href: '/' },
          { label: categoryName },
        ]}
      />

      <h1 className="font-serif text-2xl sm:text-3xl text-brand-dark mb-6">
        {categoryName}
      </h1>

      {category.products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">{t('no_products_found')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {category.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={setSelectedProduct}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default CategoryPageClient;
