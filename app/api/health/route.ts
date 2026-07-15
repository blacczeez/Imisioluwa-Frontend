export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { json } from '@/lib/server/http';

export async function GET() {
  return json({ status: 'ok', service: 'frontend-next-api' });
}
