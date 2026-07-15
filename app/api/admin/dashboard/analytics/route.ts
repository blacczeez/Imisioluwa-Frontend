import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import { getAnalytics } from '@/lib/server/services/adminService';

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const period = request.nextUrl.searchParams.get('period');
    const result = await getAnalytics(period);
    return json(result.body, result.status);
  });
}
