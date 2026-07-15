export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import { listCategories, createCategory } from '@/lib/server/services/categoryService';

export async function GET() {
  const result = await listCategories();
  return json(result.body, result.status);
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const body = await request.json();
    const result = await createCategory(body);
    return json(result.body, result.status);
  });
}
