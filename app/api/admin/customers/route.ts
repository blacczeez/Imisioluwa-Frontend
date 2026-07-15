export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import { getAllCustomers } from '@/lib/server/services/adminService';

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const { searchParams } = request.nextUrl;
    const result = await getAllCustomers({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });
    return json(result.body, result.status);
  });
}
