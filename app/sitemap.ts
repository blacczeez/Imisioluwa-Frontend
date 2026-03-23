import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

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
  ];

  let productPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];

  try {
    const productsRes = await fetch(`${API_URL}/products`, {
      next: { revalidate: 3600 },
    });
    if (productsRes.ok) {
      const productsData = await productsRes.json();
      const products = productsData.products || productsData;
      productPages = products.map((product: any) => ({
        url: `${SITE_URL}/product/${product.slug ?? product.id}`,
        lastModified: new Date(product.updated_at || product.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  try {
    const categoriesRes = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 3600 },
    });
    if (categoriesRes.ok) {
      const categories = await categoriesRes.json();
      categoryPages = categories.map((category: any) => ({
        url: `${SITE_URL}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
