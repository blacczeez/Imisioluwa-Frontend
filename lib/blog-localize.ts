import type { BlogPost } from './blog-types';
import type { BlogPostTranslation } from './blog-localize-types';
import { parseStoreLocale, type StoreLocale } from './store-locale';
import { BLOG_TRANSLATIONS_FR } from './blog-locale-fr';
import { BLOG_TRANSLATIONS_YO } from './blog-locale-yo';

const MAP: Record<StoreLocale, Record<string, BlogPostTranslation> | undefined> = {
  en: undefined,
  yo: BLOG_TRANSLATIONS_YO,
  fr: BLOG_TRANSLATIONS_FR,
};

export function getLocalizedBlogPost(post: BlogPost, locale: StoreLocale): BlogPost {
  if (locale === 'en') return post;
  const t = MAP[locale]?.[post.slug];
  if (!t) return post;
  return {
    ...post,
    title: t.title,
    metaDescription: t.metaDescription,
    excerpt: t.excerpt,
    keywords: t.keywords ?? post.keywords,
    sections: t.sections,
    faqs: t.faqs !== undefined ? t.faqs : post.faqs,
    howTo: t.howTo !== undefined ? t.howTo : post.howTo,
  };
}

export function getBlogPostTitle(post: BlogPost, locale: string): string {
  return getLocalizedBlogPost(post, parseStoreLocale(locale)).title;
}
