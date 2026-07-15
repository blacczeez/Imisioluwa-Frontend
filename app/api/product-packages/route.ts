import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import { listPackages } from '@/lib/server/services/packageService';
import { createPackage } from '@/lib/server/services/packageWriteService';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const result = await listPackages({
    promoted: searchParams.get('promoted'),
    include_inactive: searchParams.get('include_inactive'),
  });
  return json(result.body, result.status);
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const body = await request.json();
    const result = await createPackage(body);
    return json(result.body, result.status);
  });
}
