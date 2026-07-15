export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import { listProducts } from '@/lib/server/services/productService';
import { createProduct } from '@/lib/server/services/productWriteService';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const result = await listProducts({
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    category: searchParams.get('category'),
    search: searchParams.get('search'),
    is_active: searchParams.get('is_active'),
    include_out_of_stock: searchParams.get('include_out_of_stock'),
    include_inactive: searchParams.get('include_inactive'),
  });
  return json(result.body, result.status);
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const body = await request.json();
    const result = await createProduct(body);
    return json(result.body, result.status);
  });
}
