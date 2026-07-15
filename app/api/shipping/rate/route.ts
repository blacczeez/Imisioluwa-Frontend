export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { getRateByCountry } from '@/lib/server/services/shippingService';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const result = await getRateByCountry({
    country: searchParams.get('country'),
    state: searchParams.get('state'),
    lga: searchParams.get('lga'),
  });
  return json(result.body, result.status);
}
