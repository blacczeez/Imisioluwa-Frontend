import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { getBuildTimeProducts } from '@/lib/build-products';
import { getBuildTimeCategorySlugs } from '@/lib/build-categories';
import { BUY_LOCATIONS_TO_BUILD } from '@/lib/buy-locations';
import { PRODUCT_USE_CASES } from '@/lib/use-cases';
import { SHOP_AUDIENCES } from '@/lib/shop-audiences';
import { YORUBA_NAME_PAGES } from '@/lib/yoruba-name-pages';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/track-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/buy`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/uses`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/products/yoruba`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];

  const products = await getBuildTimeProducts();
  productPages = products.map((product) => ({
    url: `${SITE_URL}/product/${product.slug ?? product.id}`,
    lastModified: new Date(product.updated_at || product.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  let categorySlugs: string[] = [];
  try {
    categorySlugs = await getBuildTimeCategorySlugs();
    categoryPages = categorySlugs.map((slug) => ({
      url: `${SITE_URL}/category/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const slugs = products.map((p) => p.slug ?? p.id);

  const buyPages: MetadataRoute.Sitemap = slugs.flatMap((productSlug) =>
    BUY_LOCATIONS_TO_BUILD.map((loc) => ({
      url: `${SITE_URL}/buy/${productSlug}/${loc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  );

  const usesPages: MetadataRoute.Sitemap = slugs.flatMap((productSlug) =>
    PRODUCT_USE_CASES.map((uc) => ({
      url: `${SITE_URL}/uses/${productSlug}/${uc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  );

  const shopPages: MetadataRoute.Sitemap = categorySlugs.flatMap((categorySlug) =>
    SHOP_AUDIENCES.map((aud) => ({
      url: `${SITE_URL}/shop/${categorySlug}/${aud.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  );

  const yorubaPages: MetadataRoute.Sitemap = YORUBA_NAME_PAGES.map((p) => ({
    url: `${SITE_URL}/products/yoruba/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...blogPages,
    ...buyPages,
    ...usesPages,
    ...shopPages,
    ...yorubaPages,
  ];
}
