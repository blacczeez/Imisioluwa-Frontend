import { Metadata } from 'next';
import { serverFetch } from '@/lib/api';
import { Product, Category } from '@/types';
import { SITE_URL } from '@/lib/constants';
import HomeClient from './home-client';

/** Home fetches live catalog; avoid static prerender against unreachable API at build time. */
export const dynamic = 'force-dynamic';

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
      serverFetch<{ products: Product[]; total: number }>('/products?limit=200&include_out_of_stock=true&include_inactive=true'),
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
        '@type': 'OnlineStore',
        name: 'Imisioluwa',
        url: SITE_URL,
        description:
          'Online store for authentic African spiritual products, herbal remedies, and Nigerian food items with local and international shipping.',
        currenciesAccepted: ['NGN', 'USD', 'GBP', 'EUR'],
        availableLanguage: ['en', 'yo'],
        areaServed: ['NG', 'GB', 'US', 'CA', 'AE', 'EU'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Imisioluwa Product Catalog',
          itemListElement: [
            { '@type': 'OfferCatalog', name: 'Spiritual Products' },
            { '@type': 'OfferCatalog', name: 'Herbal Remedies' },
            { '@type': 'OfferCatalog', name: 'Food and Spices' },
            { '@type': 'OfferCatalog', name: 'Cultural Goods' },
          ],
        },
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
