import type { BlogPost } from './blog-types';
import { BLOG_POSTS_CORE } from './blog-posts-core';
import { BLOG_POSTS_MORE } from './blog-posts-more';

export type { BlogFaq, BlogSection, BlogPost, BlogHowTo, BlogHowToStep } from './blog-types';

export const BLOG_POSTS: BlogPost[] = [...BLOG_POSTS_CORE, ...BLOG_POSTS_MORE];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
