import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getBuildTimeProductSlugs } from '@/lib/build-products';
import { SITE_URL } from '@/lib/constants';
import { PRODUCT_USE_CASES } from '@/lib/use-cases';
import { serverFetch } from '@/lib/api';
import type { Product } from '@/types';

interface Props {
  params: Promise<{ productSlug: string; useCaseSlug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getBuildTimeProductSlugs();
  if (slugs.length === 0) return [];
  const params: { productSlug: string; useCaseSlug: string }[] = [];
  for (const productSlug of slugs) {
    for (const uc of PRODUCT_USE_CASES) {
      params.push({ productSlug, useCaseSlug: uc.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug, useCaseSlug } = await params;
  const uc = PRODUCT_USE_CASES.find((u) => u.slug === useCaseSlug);
  if (!uc) return { title: 'Not Found' };
  try {
    const product = await serverFetch<Product>(`/products/slug/${productSlug}`, { revalidate: 3600 });
    const url = `${SITE_URL}/uses/${productSlug}/${useCaseSlug}`;
    const title = `${product.name_en} for ${uc.headline}`;
    const description = `How people traditionally frame ${product.name_en} when focusing on ${uc.headline}. Practical steps, safety notes, and a link to buy from Imisioluwa.`;

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
        type: 'article',
      },
    };
  } catch {
    return { title: 'Product Not Found' };
  }
}

export default async function ProductUseCasePage({ params }: Props) {
  const { productSlug, useCaseSlug } = await params;
  const uc = PRODUCT_USE_CASES.find((u) => u.slug === useCaseSlug);
  if (!uc) notFound();

  let product: Product;
  try {
    product = await serverFetch<Product>(`/products/slug/${productSlug}`, { revalidate: 3600 });
  } catch {
    notFound();
  }

  const productPath = `/product/${product.slug ?? product.id}`;
  const pageUrl = `${SITE_URL}/uses/${productSlug}/${useCaseSlug}`;

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Using ${product.name_en} with a ${uc.headline} intention`,
    description: uc.intro,
    step: uc.steps.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `Step ${i + 1}`,
      text,
    })),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is this medical advice?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. This page is general cultural and shopper education. For health concerns, consult a qualified professional.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where do I purchase this product?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Use the main Imisioluwa product page for ${product.name_en} to see live price, stock, and checkout options.`,
        },
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Uses', href: '/uses' },
          { label: `${product.name_en} — ${uc.headline}` },
        ]}
      />

      <h1 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-4">
        {product.name_en} for {uc.headline}
      </h1>
      <p className="text-gray-600 mb-6 leading-relaxed">{uc.intro}</p>

      <section className="mb-8">
        <h2 className="font-serif text-xl text-brand-dark mb-3">Steps people often follow</h2>
        <ol className="list-decimal pl-5 space-y-3 text-gray-700">
          {uc.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <div className="bg-white border border-border rounded-xl p-5 mb-8">
        <p className="text-sm text-gray-600 mb-4">
          Product copy and price are always on the main listing. This guide page is for search and education only.
        </p>
        <Link
          href={productPath}
          className="inline-flex py-3 px-5 bg-brand hover:bg-brand-light text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
        >
          Open {product.name_en}
        </Link>
      </div>
    </div>
  );
}
