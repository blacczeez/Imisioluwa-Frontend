import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import { getInventoryStatus } from '@/lib/server/services/adminService';

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const result = await getInventoryStatus();
    return json(result.body, result.status);
  });
}
