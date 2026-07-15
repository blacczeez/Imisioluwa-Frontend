import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import {
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from '@/lib/server/services/categoryService';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const params = await Promise.resolve(context.params);
  const result = await getCategoryBySlug(params.slug);
  return json(result.body, result.status);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const params = await Promise.resolve(context.params);
  return withAdmin(request, async () => {
    const body = await request.json();
    const result = await updateCategory(params.slug, body);
    return json(result.body, result.status);
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const params = await Promise.resolve(context.params);
  return withAdmin(request, async () => {
    const result = await deleteCategory(params.slug);
    return json(result.body, result.status);
  });
}
