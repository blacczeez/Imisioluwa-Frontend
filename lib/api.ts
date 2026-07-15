/**
 * Client/SSR API base URL helpers.
 * Switch backends with NEXT_PUBLIC_API_MODE=next | express
 */

export type ApiMode = 'next' | 'express';

export function getApiMode(): ApiMode {
  const mode = (process.env.NEXT_PUBLIC_API_MODE || 'next').toLowerCase();
  return mode === 'express' ? 'express' : 'next';
}

/**
 * Base URL for browser requests (axios, EventSource, etc.).
 * Keep “localhost” in express mode so dev HTTPS / cookies behave.
 */
export function getClientApiBaseUrl(): string {
  if (getApiMode() === 'next') return '/api';
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
}

/** @deprecated Use getClientApiBaseUrl() */
export const CLIENT_API_URL = getClientApiBaseUrl();

/**
 * During SSR and `next build`, Node’s fetch often resolves `localhost` to `::1` first. If the API
 * only listens on IPv4 (`0.0.0.0`), that yields ECONNREFUSED and the app calls `notFound()` → 404.
 * Force IPv4 loopback for server-side fetches when hostname is localhost.
 */
export function getServerSideApiBaseUrl(): string {
  if (getApiMode() === 'next') {
    const site =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.FRONTEND_URL ||
      'http://127.0.0.1:3000';
    return `${site.replace(/\/$/, '')}/api`;
  }

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
