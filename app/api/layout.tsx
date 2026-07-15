import type { ReactNode } from 'react';

/**
 * All /api/* Route Handlers must be dynamic (auth headers, DB, query params).
 * Without this, `next build` tries to statically prerender them and fails.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function ApiLayout({ children }: { children: ReactNode }) {
  return children;
}
