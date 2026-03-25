import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { YORUBA_NAME_PAGES } from '@/lib/yoruba-name-pages';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Yoruba product names explained',
  description:
    'Educational pages for Yoruba names of soaps, oils, and ingredients — built for searchers using Yoruba terms.',
  alternates: { canonical: `${SITE_URL}/products/yoruba` },
};

export default function YorubaHubPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Yoruba terms' }]} />
      <h1 className="font-serif text-3xl text-brand-dark mb-4">Yoruba terms</h1>
      <p className="text-gray-600 mb-8">
        Cultural and shopper-focused explainers. These are not substitutes for in-person teaching in living traditions.
      </p>
      <ul className="space-y-3">
        {YORUBA_NAME_PAGES.map((p) => (
          <li key={p.slug}>
            <Link href={`/products/yoruba/${p.slug}`} className="text-brand hover:text-brand-light font-medium">
              {p.yorubaTerm}
            </Link>
            <span className="text-gray-500 text-sm"> — {p.englishHint}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
