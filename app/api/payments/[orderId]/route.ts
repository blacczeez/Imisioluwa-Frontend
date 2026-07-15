export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { json, apiError } from '@/lib/server/http';
import { getPaymentsByOrderId } from '@/lib/server/services/paymentControllerService';

export async function GET(
  _request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const result = await getPaymentsByOrderId(params.orderId);
    return json(result.body, result.status);
  } catch (err) {
    console.error('Get payments error:', err);
    return apiError('Server error', 500);
  }
}
