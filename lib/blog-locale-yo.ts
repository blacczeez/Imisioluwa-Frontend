import type { BlogPostTranslation } from './blog-localize-types';
import { BLOG_YO_1 } from './blog-locale-yo-1';
import { BLOG_YO_2 } from './blog-locale-yo-2';
import { BLOG_YO_3 } from './blog-locale-yo-3';
import { BLOG_YO_4 } from './blog-locale-yo-4';

export const BLOG_TRANSLATIONS_YO: Record<string, BlogPostTranslation> = {
  ...BLOG_YO_1,
  ...BLOG_YO_2,
  ...BLOG_YO_3,
  ...BLOG_YO_4,
};
