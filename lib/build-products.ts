import type { Product } from '@/types';
import { getServerSideApiBaseUrl } from '@/lib/api';

/** Public listing is paginated; use a high limit for sitemap / static generation. */
export async function getBuildTimeProducts(): Promise<Product[]> {
  try {
    const base = getServerSideApiBaseUrl();
    const res = await fetch(`${base}/products?limit=500&page=1`, {
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
      `[build-products] Could not reach ${getServerSideApiBaseUrl()}. Pre-render/sitemap product URLs skipped; ensure NEXT_PUBLIC_API_MODE=next (or start Express + NEXT_PUBLIC_API_URL) for a full static build.`,
    );
    return [];
  }
}

export async function getBuildTimeProductSlugs(): Promise<string[]> {
  const products = await getBuildTimeProducts();
  return products.map((p) => p.slug ?? p.id);
}
