import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import {
  updateShippingZone,
  deleteShippingZone,
} from '@/lib/server/services/shippingService';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params);
  return withAdmin(request, async () => {
    const body = await request.json();
    const result = await updateShippingZone(params.id, body);
    return json(result.body, result.status);
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params);
  return withAdmin(request, async () => {
    const result = await deleteShippingZone(params.id);
    return json(result.body, result.status);
  });
}
