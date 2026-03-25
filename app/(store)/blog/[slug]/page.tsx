import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BLOG_POSTS, getBlogPostBySlug } from '@/lib/blog-posts';
import { SITE_URL } from '@/lib/constants';
import { getLocalizedBlogPost } from '@/lib/blog-localize';
import {
  BLOG_ARTICLE_UI,
  blogArticleNotFoundTitle,
  dateLocaleTag,
  ogLocaleTag,
} from '@/lib/blog-copy';
import { LOCALE_COOKIE, parseStoreLocale, type StoreLocale } from '@/lib/store-locale';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

function getLocale(): StoreLocale {
  return parseStoreLocale(cookies().get(LOCALE_COOKIE)?.value);
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  const locale = getLocale();

  if (!post) {
    return {
      title: blogArticleNotFoundTitle(locale),
    };
  }

  const localized = getLocalizedBlogPost(post, locale);
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: localized.title,
    description: localized.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${localized.title} | Imisioluwa`,
      description: localized.metaDescription,
      url: canonicalUrl,
      type: 'article',
      locale: ogLocaleTag(locale),
      siteName: 'Imisioluwa',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: localized.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${localized.title} | Imisioluwa`,
      description: localized.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  const locale = getLocale();
  const ui = BLOG_ARTICLE_UI[locale];
  const dateLocale = dateLocaleTag(locale);

  if (!post) {
    notFound();
  }

  const localized = getLocalizedBlogPost(post, locale);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: localized.title,
    description: localized.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Imisioluwa',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Imisioluwa',
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    keywords: localized.keywords.join(', '),
  };

  const faqJsonLd = localized.faqs
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: localized.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  const howToJsonLd = localized.howTo
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: localized.howTo.name,
        description: localized.howTo.description,
        step: localized.howTo.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
        })),
      }
    : null;

  return (
    <article className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {howToJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      ) : null}
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <Breadcrumbs
        items={[
          { label: ui.home, href: '/' },
          { label: ui.blog, href: '/blog' },
          { label: localized.title },
        ]}
      />

      <header className="mb-8">
        <p className="text-xs uppercase tracking-label text-gray-400 mb-2">
          {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-brand-dark leading-tight mb-4">
          {localized.title}
        </h1>
        <p className="text-base text-gray-600">{localized.excerpt}</p>
      </header>

      <div className="space-y-8">
        {localized.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-serif text-2xl text-brand-dark mb-3">{section.heading}</h2>
            <div className="space-y-4 text-gray-700 leading-7">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {localized.faqs && localized.faqs.length > 0 ? (
        <section className="mt-10 pt-8 border-t border-border">
          <h2 className="font-serif text-2xl text-brand-dark mb-4">{ui.faq}</h2>
          <div className="space-y-4">
            {localized.faqs.map((faq) => (
              <div key={faq.question} className="bg-white border border-border rounded-lg p-4">
                <h3 className="font-semibold text-brand-dark mb-2">{faq.question}</h3>
                <p className="text-gray-700 text-sm leading-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="font-serif text-2xl text-brand-dark mb-3">{ui.continueH2}</h2>
        <p className="text-sm text-gray-600 mb-4">{ui.continueP}</p>
        <Link href="/blog" className="text-sm font-semibold uppercase tracking-label text-brand hover:text-brand-light">
          {ui.viewAll}
        </Link>
      </section>
    </article>
  );
}
