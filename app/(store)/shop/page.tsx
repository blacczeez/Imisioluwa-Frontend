import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SHOP_AUDIENCES } from '@/lib/shop-audiences';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Shop by category and audience',
  description:
    'Audience-focused shop pages for Nigerians in the UK, USA, Canada, UAE, and more — powered by your live category catalog.',
  alternates: { canonical: `${SITE_URL}/shop` },
};

export default function ShopHubPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shop by audience' }]} />
      <h1 className="font-serif text-3xl text-brand-dark mb-4">Shop by audience</h1>
      <p className="text-gray-600 mb-6">
        Each category in your store gets a page per audience segment (for example:{' '}
        <code className="text-sm bg-brand-50 px-1 rounded">/shop/spiritual-products/nigerians-in-uk</code>). Segments:
      </p>
      <ul className="list-disc pl-5 text-gray-700 space-y-2">
        {SHOP_AUDIENCES.map((a) => (
          <li key={a.slug}>
            <span className="font-medium text-brand-dark">{a.title}</span>
            <span className="text-gray-500"> — {a.slug}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
