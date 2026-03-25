import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BUY_LOCATIONS_TO_BUILD } from '@/lib/buy-locations';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Buy African spiritual & traditional products by city',
  description:
    'Find Imisioluwa products with city-focused landing pages for the UK, US, Canada, UAE, EU, and Nigeria — same catalog, clearer local SEO.',
  alternates: { canonical: `${SITE_URL}/buy` },
};

export default function BuyHubPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Buy by location' }]} />

      <h1 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-4">Buy by location</h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        These pages help diaspora and international buyers find our catalog when they search for a product in a
        specific city. Each URL pairs an in-stock product with a delivery region. Always confirm final shipping and
        totals at checkout.
      </p>

      <h2 className="font-serif text-xl text-brand-dark mb-3">Cities we build pages for</h2>
      <ul className="flex flex-wrap gap-2">
        {BUY_LOCATIONS_TO_BUILD.map((loc) => (
          <li key={loc.slug}>
            <span className="inline-block text-xs uppercase tracking-label px-3 py-1.5 rounded-full border border-border text-brand-dark">
              {loc.name}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500 mt-4">
        Tip: open any product, then use a search engine query like &quot;buy [product] in London&quot; — matching
        landing pages are linked from the site structure and sitemap.
      </p>
    </div>
  );
}
