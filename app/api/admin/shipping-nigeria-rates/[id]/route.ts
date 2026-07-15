import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import { deleteNigeriaShippingRate } from '@/lib/server/services/shippingService';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params);
  return withAdmin(request, async () => {
    const result = await deleteNigeriaShippingRate(params.id);
    return json(result.body, result.status);
  });
}
