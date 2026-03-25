import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { PRODUCT_USE_CASES } from '@/lib/use-cases';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Traditional product uses and intentions',
  description:
    'Educational guides pairing Imisioluwa products with common spiritual and wellness intentions. Not medical advice.',
  alternates: { canonical: `${SITE_URL}/uses` },
};

export default function UsesHubPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Uses' }]} />
      <h1 className="font-serif text-3xl text-brand-dark mb-4">Uses</h1>
      <p className="text-gray-600 mb-6">
        We generate use-case pages for each in-stock product combined with these intents:
      </p>
      <ul className="list-disc pl-5 text-gray-700 space-y-2">
        {PRODUCT_USE_CASES.map((uc) => (
          <li key={uc.slug}>
            <span className="font-medium text-brand-dark">{uc.headline}</span>
            <span className="text-gray-500"> — /uses/[product]/{uc.slug}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
