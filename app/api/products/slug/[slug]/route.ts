import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { getProductBySlug } from '@/lib/server/services/productService';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const params = await Promise.resolve(context.params);
  const result = await getProductBySlug(params.slug);
  return json(result.body, result.status);
}
