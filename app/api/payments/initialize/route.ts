import { z } from 'zod';
import { NextRequest } from 'next/server';
import { json, validationError, apiError } from '@/lib/server/http';
import { initializePayment } from '@/lib/server/services/paymentControllerService';

const schema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  email: z.string().email('Valid email is required'),
  amount: z.number().positive('Valid amount is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return validationError(
        parsed.error.issues.map((i) => ({ msg: i.message, path: i.path.join('.') }))
      );
    }

    const result = await initializePayment(parsed.data);
    return json(result.body, result.status);
  } catch (err) {
    console.error('Initialize payment error:', err);
    return apiError('Payment initialization failed', 500);
  }
}
