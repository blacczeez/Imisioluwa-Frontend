import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { stripeWebhook } from '@/lib/server/services/paymentControllerService';

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const signature = request.headers.get('stripe-signature');
  const result = await stripeWebhook(Buffer.from(raw), signature);
  return json(result.body, result.status);
}
