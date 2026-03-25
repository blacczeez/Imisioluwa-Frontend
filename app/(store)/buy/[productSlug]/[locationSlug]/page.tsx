import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { serverFetch } from '@/lib/api';
import { getBuildTimeProductSlugs } from '@/lib/build-products';
import { BUY_LOCATIONS_TO_BUILD, getBuyLocationBySlug } from '@/lib/buy-locations';
import { SITE_URL } from '@/lib/constants';
import type { Product } from '@/types';

interface Props {
  params: Promise<{ productSlug: string; locationSlug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getBuildTimeProductSlugs();
  if (slugs.length === 0) return [];
  const params: { productSlug: string; locationSlug: string }[] = [];
  for (const productSlug of slugs) {
    for (const loc of BUY_LOCATIONS_TO_BUILD) {
      params.push({ productSlug, locationSlug: loc.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug, locationSlug } = await params;
  const location = getBuyLocationBySlug(locationSlug);
  if (!location) return { title: 'Page Not Found' };

  try {
    const product = await serverFetch<Product>(`/products/slug/${productSlug}`, { revalidate: 3600 });
    const url = `${SITE_URL}/buy/${productSlug}/${locationSlug}`;
    const title = `Buy ${product.name_en} in ${location.name} — Fast delivery`;
    const description = `Order ${product.name_en} to ${location.name}. Authentic African products from Imisioluwa with delivery in ${location.regionLabel}.`;
    const image = product.image_urls?.[0];

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title: `${title} | Imisioluwa`,
        description,
        url,
        siteName: 'Imisioluwa',
        locale: 'en_NG',
        type: 'website',
        images: image ? [{ url: image }] : [],
      },
      twitter: {
        card: image ? 'summary_large_image' : 'summary',
        title: `${title} | Imisioluwa`,
        description,
        images: image ? [image] : [],
      },
    };
  } catch {
    return { title: 'Product Not Found' };
  }
}

export default async function BuyLocationPage({ params }: Props) {
  const { productSlug, locationSlug } = await params;
  const location = getBuyLocationBySlug(locationSlug);
  if (!location) notFound();

  let product: Product;
  try {
    product = await serverFetch<Product>(`/products/slug/${productSlug}`, { revalidate: 3600 });
  } catch {
    notFound();
  }

  const productPath = `/product/${product.slug ?? product.id}`;
  const pageUrl = `${SITE_URL}/buy/${productSlug}/${locationSlug}`;
  const image = product.image_urls?.[0];

  const faq = [
    {
      q: `Do you ship ${product.name_en} to ${location.name}?`,
      a: `Imisioluwa fulfils orders for buyers in ${location.name} and the wider ${location.regionLabel} region. Exact timelines depend on courier and customs for your basket. Confirm at checkout and on your order confirmation email.`,
    },
    {
      q: 'Is this the same product as on the main product page?',
      a: 'Yes. This page is a local landing page to help people searching by city and product name. The product, price, and stock are the same as on the main Imisioluwa product page.',
    },
    {
      q: 'What currencies can I use?',
      a: 'Imisioluwa supports Naira for Nigeria and USD, GBP, and EUR for international buyers where enabled. Pick your currency in the header before checkout.',
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Buy ${product.name_en} in ${location.name}`,
    description: `Order ${product.name_en} with delivery oriented to ${location.name} and ${location.regionLabel}.`,
    url: pageUrl,
    publisher: { '@type': 'Organization', name: 'Imisioluwa', url: SITE_URL },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Buy', href: '/buy' },
          { label: `${product.name_en} in ${location.name}` },
        ]}
      />

      <h1 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-4">
        Buy {product.name_en} in {location.name} — Fast delivery from Imisioluwa
      </h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Shop authentic African traditional and spiritual products for delivery to{' '}
        <strong>{location.name}</strong> and buyers across {location.regionLabel}. This page helps you find{' '}
        {product.name_en} when you search by city; you complete purchase on the main product page with the same
        details and stock.
      </p>

      <div className="bg-white border border-border rounded-xl overflow-hidden flex flex-col sm:flex-row gap-6 p-5 sm:p-6">
        <div className="relative w-full sm:w-52 h-48 shrink-0 bg-brand-50 rounded-lg overflow-hidden">
          {image ? (
            <Image src={image} alt={product.name_en} fill className="object-cover" sizes="208px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-xl text-brand-dark mb-2">{product.name_en}</h2>
          <p className="text-sm text-gray-600 line-clamp-4 mb-4">{product.description_en}</p>
          <Link
            href={productPath}
            className="inline-flex items-center justify-center py-3 px-5 bg-brand hover:bg-brand-light text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
          >
            View product & buy
          </Link>
        </div>
      </div>

      <section className="mt-10" id="faq">
        <h2 className="font-serif text-2xl text-brand-dark mb-4">Frequently asked questions</h2>
        <ul className="space-y-4">
          {faq.map((item) => (
            <li key={item.q} className="bg-white border border-border rounded-lg p-4">
              <p className="font-semibold text-brand-dark mb-2">{item.q}</p>
              <p className="text-sm text-gray-600 leading-6">{item.a}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
