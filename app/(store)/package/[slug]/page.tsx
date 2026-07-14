import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { encodeApiPathSegment, serverFetch } from '@/lib/api';
import { Package } from '@/types';
import { SITE_URL } from '@/lib/constants';
import PackagePageClient from './package-client';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!slug?.trim()) {
    return { title: 'Package Not Found' };
  }

  try {
    const pkg = await serverFetch<Package>(`/packages/slug/${encodeApiPathSegment(slug.trim())}`);
    const packageUrl = `${SITE_URL}/package/${pkg.slug}`;
    const description = pkg.description_en?.trim()
      ? `${pkg.description_en.slice(0, 140)} Curated bundle from Imisioluwa.`
      : `${pkg.name_en} — curated problem-solution package from Imisioluwa.`;

    return {
      title: `${pkg.name_en} - Problem-Solution Package`,
      description,
      openGraph: {
        title: `${pkg.name_en} | Imisioluwa`,
        description,
        url: packageUrl,
        siteName: 'Imisioluwa',
        images: pkg.image_url ? [{ url: pkg.image_url }] : [],
        locale: 'en_NG',
        type: 'website',
      },
      alternates: {
        canonical: packageUrl,
      },
    };
  } catch {
    return { title: 'Package Not Found' };
  }
}

export default async function PackagePage({ params }: Props) {
  const { slug } = await params;
  if (!slug?.trim()) {
    notFound();
  }

  try {
    const pkg = await serverFetch<Package>(`/packages/slug/${encodeApiPathSegment(slug.trim())}`);
    return <PackagePageClient pkg={pkg} />;
  } catch {
    notFound();
  }
}
