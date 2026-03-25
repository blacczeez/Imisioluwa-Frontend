import Link from 'next/link';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'African Spiritual Products Blog and Guides',
  description:
    'Explore practical guides on African spiritual soaps, Yoruba traditions, herbs, spices, and authentic Nigerian products for diaspora buyers.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'Imisioluwa Blog - African Spiritual and Cultural Guides',
    description:
      'Learn about Ose Dudu, Ose Asina, Yoruba traditions, and how to buy authentic Nigerian products online.',
    url: `${SITE_URL}/blog`,
    siteName: 'Imisioluwa',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog' },
        ]}
      />

      <header className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-3">
          Imisioluwa Blog
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Practical guides on authentic African spiritual products, traditional ingredients,
          and buying Nigerian products online from anywhere in the world.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {BLOG_POSTS.map((post) => (
          <article key={post.slug} className="bg-white border border-border rounded-xl p-5">
            <p className="text-xs uppercase tracking-label text-gray-400 mb-2">
              {new Date(post.publishedAt).toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <h2 className="font-serif text-xl text-brand-dark mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-brand transition-colors">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-600 mb-4">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="text-sm font-semibold uppercase tracking-label text-brand hover:text-brand-light"
            >
              Read article
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
