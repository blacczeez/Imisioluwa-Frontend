'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import { productService } from '@/services/products';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { getCategoryName, getProductPrice } from '@/utils/helpers';
import { Spinner, CustomSelect } from '@/components/ui';
import HeroCarousel from '@/components/HeroCarousel';

interface HomeClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

const HomeClient: React.FC<HomeClientProps> = ({ initialProducts, initialCategories }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Re-fetch if initial data was empty (SSR failed)
  useEffect(() => {
    if (initialProducts.length === 0) {
      loadData();
    }
  }, [initialProducts.length]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        productService.getCategories(),
      ]);
      setProducts(productsData.products);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      product.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name_yo.toLowerCase().includes(searchQuery.toLowerCase());
    const hasPrice = getProductPrice(product, currency) !== null;
    return matchesCategory && matchesSearch && product.is_active && hasPrice;
  });

  const categoriesWithProducts = categories.filter((category) =>
    filteredProducts.some((product) => product.category_id === category.id)
  );

  return (
    <div>
      {/* <div className="mb-6 sm:mb-12">
        <HeroCarousel />
      </div> */}

      <h1 className="font-serif text-2xl sm:text-3xl text-brand-dark mb-3 sm:mb-4">
        {t('shop_our_collection', 'Authentic African Traditional & Spiritual Products')}
      </h1>

      {/* Search & Category (sticky) */}
      <div className="sticky top-0 z-20 bg-cream py-2 mb-4 sm:mb-6">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 sm:pl-11 sm:pr-4 sm:py-3 text-base border border-border rounded-lg focus:ring-2 focus:ring-brand-light focus:border-transparent transition-colors bg-white"
            />
          </div>
          <CustomSelect
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder={t('all_categories')}
            options={[
              { value: '', label: t('all_categories') },
              ...categories.map((category) => ({
                value: category.id,
                label: getCategoryName(category, language),
              })),
            ]}
            variant="form"
            className="min-w-[180px]"
            aria-label={t('all_categories')}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Spinner size="lg" className="text-brand mx-auto" />
          <p className="mt-4 text-gray-500 text-sm">{t('loading')}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">{t('no_products_found')}</p>
        </div>
      ) : (
        <div className="space-y-10">
          {categoriesWithProducts.map((category) => (
            <section key={category.id}>
              <h2 className="font-serif text-xl sm:text-2xl text-brand-dark mb-3 sm:mb-4 sticky top-12 sm:top-16 bg-cream z-10 py-1.5 sm:py-2">
                <Link href={`/category/${category.slug}`} className="hover:text-brand transition-colors">
                  {getCategoryName(category, language)}
                </Link>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts
                  .filter((product) => product.category_id === category.id)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}

    </div>
  );
};

export default HomeClient;
