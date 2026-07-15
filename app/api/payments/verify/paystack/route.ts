import { NextRequest } from 'next/server';
import { json, apiError } from '@/lib/server/http';
import { verifyPaystack } from '@/lib/server/services/paymentControllerService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await verifyPaystack(body);
    return json(result.body, result.status);
  } catch (err) {
    console.error('Verify Paystack error:', err);
    return apiError('Payment verification failed', 500);
  }
}
