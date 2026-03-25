import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_URL } from '@/lib/constants';
import { YORUBA_NAME_PAGES, getYorubaNamePageBySlug } from '@/lib/yoruba-name-pages';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return YORUBA_NAME_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getYorubaNamePageBySlug(slug);
  if (!page) return { title: 'Not Found' };
  const url = `${SITE_URL}/products/yoruba/${page.slug}`;
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${page.title} | Imisioluwa`,
      description: page.metaDescription,
      url,
      siteName: 'Imisioluwa',
      type: 'article',
      locale: 'en_NG',
    },
  };
}

export default async function YorubaNamePage({ params }: Props) {
  const { slug } = await params;
  const page = getYorubaNamePageBySlug(slug);
  if (!page) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.metaDescription,
    author: { '@type': 'Organization', name: 'Imisioluwa' },
    publisher: { '@type': 'Organization', name: 'Imisioluwa', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/products/yoruba/${page.slug}`,
  };

  return (
    <article className="max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Yoruba terms', href: '/products/yoruba' },
          { label: page.yorubaTerm },
        ]}
      />

      <h1 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-2">{page.title}</h1>
      <p className="text-sm text-gray-500 mb-8">
        Yoruba: <span className="font-medium text-brand-dark">{page.yorubaTerm}</span> — commonly understood as{' '}
        {page.englishHint}.
      </p>

      <div className="space-y-8 text-gray-700 leading-7">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-serif text-2xl text-brand-dark mb-3">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="mb-3">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-border">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-label text-brand hover:text-brand-light"
        >
          Browse the store
        </Link>
      </div>
    </article>
  );
}
