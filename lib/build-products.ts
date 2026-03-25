import type { Product } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/** Public listing is paginated; use a high limit for sitemap / static generation. */
export async function getBuildTimeProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products?limit=500&page=1`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const products = (data.products || data) as Product[];
    if (!Array.isArray(products)) return [];
    return products.filter((p) => p.is_active !== false && p.stock_quantity > 0);
  } catch {
    // Build often runs without the API; ECONNREFUSED throws before res.ok.
    console.warn(
      `[build-products] Could not reach ${API_URL}. Pre-render/sitemap product URLs skipped; start the backend or set NEXT_PUBLIC_API_URL for a full static build.`,
    );
    return [];
  }
}

export async function getBuildTimeProductSlugs(): Promise<string[]> {
  const products = await getBuildTimeProducts();
  return products.map((p) => p.slug ?? p.id);
}
