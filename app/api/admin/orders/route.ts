export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import { getAllOrders } from '@/lib/server/services/adminService';

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const { searchParams } = request.nextUrl;
    const result = await getAllOrders({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      status: searchParams.get('status'),
      payment_status: searchParams.get('payment_status'),
      search: searchParams.get('search'),
    });
    return json(result.body, result.status);
  });
}
