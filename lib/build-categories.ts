import type { Category } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getBuildTimeCategorySlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const categories = (await res.json()) as Category[];
    if (!Array.isArray(categories)) return [];
    return categories.map((c) => c.slug).filter(Boolean);
  } catch {
    console.warn(
      `[build-categories] Could not reach ${API_URL}. Pre-render/sitemap category URLs skipped; start the backend or set NEXT_PUBLIC_API_URL for a full static build.`,
    );
    return [];
  }
}
