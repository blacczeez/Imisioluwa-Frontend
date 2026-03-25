'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/context/LanguageContext';
import { getCategoryName } from '@/utils/helpers';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_URL } from '@/lib/constants';
import { BLOG_POSTS } from '@/lib/blog-posts';

interface CategoryPageClientProps {
  category: Category & { products: Product[] };
}

const CategoryPageClient: React.FC<CategoryPageClientProps> = ({ category }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const categoryName = getCategoryName(category, language);
  const categoryUrl = `${SITE_URL}/category/${category.slug}`;
  const relatedPosts = BLOG_POSTS.map((post) => {
    const categoryText = category.name_en.toLowerCase();
    const score = post.keywords.reduce((acc, keyword) => {
      const tokens = keyword.toLowerCase().split(' ');
      const tokenHits = tokens.filter((token) => token.length > 2 && categoryText.includes(token)).length;
      return acc + tokenHits;
    }, 0);
    return { post, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.post);

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
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {relatedPosts.length > 0 && (
        <section className="mt-10 pt-8 border-t border-border">
          <h2 className="font-serif text-2xl text-brand-dark mb-3">Related Guides</h2>
          <div className="space-y-2">
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block text-sm text-brand hover:text-brand-light transition-colors"
              >
                {post.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CategoryPageClient;
