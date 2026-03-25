import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getBuildTimeCategorySlugs } from '@/lib/build-categories';
import { SITE_URL } from '@/lib/constants';
import { SHOP_AUDIENCES } from '@/lib/shop-audiences';
import { serverFetch } from '@/lib/api';
import type { Category, Product } from '@/types';
import ShopAudienceClient from './shop-audience-client';

interface Props {
  params: Promise<{ categorySlug: string; audienceSlug: string }>;
}

export async function generateStaticParams() {
  const categorySlugs = await getBuildTimeCategorySlugs();
  if (categorySlugs.length === 0) return [];
  const params: { categorySlug: string; audienceSlug: string }[] = [];
  for (const categorySlug of categorySlugs) {
    for (const aud of SHOP_AUDIENCES) {
      params.push({ categorySlug, audienceSlug: aud.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, audienceSlug } = await params;
  const aud = SHOP_AUDIENCES.find((a) => a.slug === audienceSlug);
  if (!aud) return { title: 'Not Found' };
  try {
    const category = await serverFetch<Category & { products: Product[] }>(`/categories/${categorySlug}`, {
      revalidate: 3600,
    });
    const url = `${SITE_URL}/shop/${categorySlug}/${audienceSlug}`;
    const title = `Shop ${category.name_en} for ${aud.title}`;
    const description = `${aud.blurb} Browse ${category.name_en} on Imisioluwa with multi-currency checkout where enabled.`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title: `${title} | Imisioluwa`,
        description,
        url,
        siteName: 'Imisioluwa',
        type: 'website',
        locale: 'en_NG',
      },
    };
  } catch {
    return { title: 'Category Not Found' };
  }
}

export default async function ShopAudiencePage({ params }: Props) {
  const { categorySlug, audienceSlug } = await params;
  const aud = SHOP_AUDIENCES.find((a) => a.slug === audienceSlug);
  if (!aud) notFound();

  let category: Category & { products: Product[] };
  try {
    category = await serverFetch<Category & { products: Product[] }>(`/categories/${categorySlug}`, {
      revalidate: 3600,
    });
  } catch {
    notFound();
  }

  const categoryPath = `/category/${category.slug}`;
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Shop ${category.name_en} — ${aud.title}`,
    description: aud.blurb,
    url: `${SITE_URL}/shop/${categorySlug}/${audienceSlug}`,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: `${category.name_en} — ${aud.title}` },
        ]}
      />

      <h1 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-3">
        Shop {category.name_en} — {aud.title}
      </h1>
      <p className="text-gray-600 max-w-2xl mb-2 leading-relaxed">{aud.blurb}</p>
      <p className="text-sm text-gray-500 mb-8">
        Full category:{' '}
        <Link href={categoryPath} className="text-brand hover:text-brand-light font-medium">
          {category.name_en}
        </Link>
      </p>

      <ShopAudienceClient products={category.products} />
    </div>
  );
}
