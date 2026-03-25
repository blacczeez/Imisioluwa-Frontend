import type { Category } from '@/types';
import { getServerSideApiBaseUrl } from '@/lib/api';

export async function getBuildTimeCategorySlugs(): Promise<string[]> {
  try {
    const base = getServerSideApiBaseUrl();
    const res = await fetch(`${base}/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const categories = (await res.json()) as Category[];
    if (!Array.isArray(categories)) return [];
    return categories.map((c) => c.slug).filter(Boolean);
  } catch {
    console.warn(
      `[build-categories] Could not reach ${getServerSideApiBaseUrl()}. Pre-render/sitemap category URLs skipped; start the backend or set NEXT_PUBLIC_API_URL for a full static build.`,
    );
    return [];
  }
}
