import { NextRequest } from 'next/server';
import { json, apiError } from '@/lib/server/http';
import { trackOrder } from '@/lib/server/services/orderService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const result = await trackOrder(
      searchParams.get('orderNumber'),
      searchParams.get('phone')
    );
    return json(result.body, result.status);
  } catch (err) {
    console.error('Track order error:', err);
    return apiError('Server error', 500);
  }
}
