import { Metadata } from 'next';
import { serverFetch } from '@/lib/api';
import { Product, Category } from '@/types';
import { SITE_URL } from '@/lib/constants';
import HomeClient from './home-client';

export const metadata: Metadata = {
  title: 'Imisioluwa — Shop Authentic African Traditional & Spiritual Products Online',
  description: 'Shop authentic African traditional soaps, spiritual oils, herbal remedies, and food products. Sourced from trusted makers with free delivery in Nigeria and worldwide shipping.',
  openGraph: {
    title: 'Imisioluwa — Shop Authentic African Traditional & Spiritual Products Online',
    description: 'Shop authentic African traditional soaps, spiritual oils, herbal remedies, and food products.',
    url: SITE_URL,
    siteName: 'Imisioluwa',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imisioluwa — Shop Authentic African Traditional & Spiritual Products Online',
    description: 'Shop authentic African traditional soaps, spiritual oils, herbal remedies, and food products.',
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function HomePage() {
  let initialProducts: Product[] = [];
  let initialCategories: Category[] = [];

  try {
    const [productsData, categoriesData] = await Promise.all([
      serverFetch<{ products: Product[]; total: number }>('/products'),
      serverFetch<Category[]>('/categories'),
    ]);
    initialProducts = productsData.products;
    initialCategories = categoriesData;
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Imisioluwa',
        url: SITE_URL,
        description: 'Shop authentic African traditional soaps, spiritual oils, herbal remedies, and food products. Sourced from trusted makers with worldwide shipping.',
      },
      {
        '@type': 'WebSite',
        name: 'Imisioluwa',
        url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <HomeClient initialProducts={initialProducts} initialCategories={initialCategories} />
    </>
  );
}
