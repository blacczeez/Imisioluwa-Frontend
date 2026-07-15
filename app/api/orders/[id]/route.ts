export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { json, apiError } from '@/lib/server/http';
import { getOrderById } from '@/lib/server/services/orderService';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getOrderById(params.id);
    return json(result.body, result.status);
  } catch (err) {
    console.error('Get order error:', err);
    return apiError('Server error', 500);
  }
}
