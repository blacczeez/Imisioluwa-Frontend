/**
 * Base URL for browser requests (axios, etc.) — keep “localhost” so dev HTTPS / cookies behave.
 */
export const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * During SSR and `next build`, Node’s fetch often resolves `localhost` to `::1` first. If the API
 * only listens on IPv4 (`0.0.0.0`), that yields ECONNREFUSED and the app calls `notFound()` → 404.
 * Force IPv4 loopback for server-side fetches when hostname is localhost.
 */
export function getServerSideApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const u = new URL(raw);
    if (u.hostname === 'localhost' || u.hostname === '::1' || u.hostname === '[::1]') {
      u.hostname = '127.0.0.1';
    }
    const basePath = u.pathname.replace(/\/$/, '');
    return `${u.origin}${basePath === '/' ? '' : basePath}` || u.origin;
  } catch {
    return raw;
  }
}

/** Encode a single path segment for Express (spaces, unicode, etc.). */
export function encodeApiPathSegment(segment: string): string {
  return encodeURIComponent(segment);
}

export async function serverFetch<T>(path: string, options?: { revalidate?: number }): Promise<T> {
  const base = getServerSideApiBaseUrl();
  const res = await fetch(`${base}${path}`, {
    next: { revalidate: options?.revalidate ?? 60 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
