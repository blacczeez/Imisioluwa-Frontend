import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import { getProductById } from '@/lib/server/services/productService';
import { updateProduct, deleteProduct } from '@/lib/server/services/productWriteService';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params);
  const result = await getProductById(params.id);
  return json(result.body, result.status);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params);
  return withAdmin(request, async () => {
    const body = await request.json();
    const result = await updateProduct(params.id, body);
    return json(result.body, result.status);
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params);
  return withAdmin(request, async () => {
    const result = await deleteProduct(params.id);
    return json(result.body, result.status);
  });
}
