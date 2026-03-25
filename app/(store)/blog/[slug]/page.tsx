import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BLOG_POSTS, getBlogPostBySlug } from '@/lib/blog-posts';
import { SITE_URL } from '@/lib/constants';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | Imisioluwa`,
      description: post.metaDescription,
      url: canonicalUrl,
      type: 'article',
      locale: 'en_NG',
      siteName: 'Imisioluwa',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Imisioluwa`,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
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
    keywords: post.keywords.join(', '),
  };

  const faqJsonLd = post.faqs
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  const howToJsonLd = post.howTo
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: post.howTo.name,
        description: post.howTo.description,
        step: post.howTo.steps.map((step, index) => ({
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
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
      />

      <header className="mb-8">
        <p className="text-xs uppercase tracking-label text-gray-400 mb-2">
          {new Date(post.publishedAt).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-brand-dark leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-base text-gray-600">{post.excerpt}</p>
      </header>

      <div className="space-y-8">
        {post.sections.map((section) => (
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

      {post.faqs && post.faqs.length > 0 ? (
        <section className="mt-10 pt-8 border-t border-border">
          <h2 className="font-serif text-2xl text-brand-dark mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {post.faqs.map((faq) => (
              <div key={faq.question} className="bg-white border border-border rounded-lg p-4">
                <h3 className="font-semibold text-brand-dark mb-2">{faq.question}</h3>
                <p className="text-gray-700 text-sm leading-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="font-serif text-2xl text-brand-dark mb-3">Continue Reading</h2>
        <p className="text-sm text-gray-600 mb-4">
          Explore more guides on Yoruba traditions, spiritual products, and authentic Nigerian goods.
        </p>
        <Link href="/blog" className="text-sm font-semibold uppercase tracking-label text-brand hover:text-brand-light">
          View all articles
        </Link>
      </section>
    </article>
  );
}
