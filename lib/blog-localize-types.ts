import type { BlogPost } from './blog-types';

/** Localizable fields only; slug and dates stay from the canonical English post. */
export type BlogPostTranslation = Pick<
  BlogPost,
  'title' | 'metaDescription' | 'excerpt' | 'keywords' | 'sections' | 'faqs' | 'howTo'
>;
