import Link from 'next/link';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { SITE_URL } from '@/lib/constants';
import { BLOG_INDEX, BLOG_ARTICLE_UI, dateLocaleTag, ogLocaleTag } from '@/lib/blog-copy';
import { LOCALE_COOKIE, parseStoreLocale, type StoreLocale } from '@/lib/store-locale';
import { getLocalizedBlogPost } from '@/lib/blog-localize';

export const dynamic = 'force-dynamic';

function getLocale(): StoreLocale {
  return parseStoreLocale(cookies().get(LOCALE_COOKIE)?.value);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const copy = BLOG_INDEX[locale];
  const canonicalUrl = `${SITE_URL}/blog`;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: copy.ogTitle,
      description: copy.ogDesc,
      url: canonicalUrl,
      siteName: 'Imisioluwa',
      locale: ogLocaleTag(locale),
      type: 'website',
    },
  };
}

export default function BlogIndexPage() {
  const locale = getLocale();
  const copy = BLOG_INDEX[locale];
  const ui = BLOG_ARTICLE_UI[locale];
  const dateLocale = dateLocaleTag(locale);

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: ui.home, href: '/' },
          { label: ui.blog },
        ]}
      />

      <header className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-3">{copy.h1}</h1>
        <p className="text-gray-600 max-w-2xl">{copy.intro}</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {BLOG_POSTS.map((post) => {
          const localized = getLocalizedBlogPost(post, locale);
          return (
            <article key={post.slug} className="bg-white border border-border rounded-xl p-5">
              <p className="text-xs uppercase tracking-label text-gray-400 mb-2">
                {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <h2 className="font-serif text-xl text-brand-dark mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-brand transition-colors">
                  {localized.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-600 mb-4">{localized.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-semibold uppercase tracking-label text-brand hover:text-brand-light"
              >
                {ui.readArticle}
              </Link>
            </article>
          );
        })}
      </section>
    </div>
  );
}
