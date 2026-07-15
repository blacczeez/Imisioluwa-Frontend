export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { json, apiError } from '@/lib/server/http';
import { verifyStripe } from '@/lib/server/services/paymentControllerService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await verifyStripe(body);
    return json(result.body, result.status);
  } catch (err) {
    console.error('Verify Stripe error:', err);
    return apiError('Verification failed', 500);
  }
}
