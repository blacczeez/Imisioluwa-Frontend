import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import {
  uploadProductImages,
  deleteProductImage,
} from '@/lib/server/services/productWriteService';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params);
  return withAdmin(request, async () => {
    const form = await request.formData();
    const files = form.getAll('images').filter((f): f is File => f instanceof File);
    const result = await uploadProductImages(params.id, files);
    return json(result.body, result.status);
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params);
  return withAdmin(request, async () => {
    const { imageUrl } = await request.json();
    const result = await deleteProductImage(params.id, imageUrl);
    return json(result.body, result.status);
  });
}
