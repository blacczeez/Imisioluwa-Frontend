import type { BlogPostTranslation } from './blog-localize-types';
import { BLOG_FR_1 } from './blog-locale-fr-1';
import { BLOG_FR_2 } from './blog-locale-fr-2';
import { BLOG_FR_3 } from './blog-locale-fr-3';
import { BLOG_FR_4 } from './blog-locale-fr-4';

export const BLOG_TRANSLATIONS_FR: Record<string, BlogPostTranslation> = {
  ...BLOG_FR_1,
  ...BLOG_FR_2,
  ...BLOG_FR_3,
  ...BLOG_FR_4,
};
