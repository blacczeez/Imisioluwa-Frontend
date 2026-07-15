export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import {
  getAllShippingZones,
  createShippingZone,
} from '@/lib/server/services/shippingService';

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const result = await getAllShippingZones();
    return json(result.body, result.status);
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const body = await request.json();
    const result = await createShippingZone(body);
    return json(result.body, result.status);
  });
}
