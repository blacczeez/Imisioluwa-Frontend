import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { getCountryFromRequest } from '@/lib/server/services/geoService';

export async function GET(request: NextRequest) {
  const result = await getCountryFromRequest(request);
  return json(result.body, result.status);
}
