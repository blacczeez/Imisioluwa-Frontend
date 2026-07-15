export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import { getPackageById } from '@/lib/server/services/packageService';
import { updatePackage, deletePackage } from '@/lib/server/services/packageWriteService';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params);
  const result = await getPackageById(params.id);
  return json(result.body, result.status);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params);
  return withAdmin(request, async () => {
    const body = await request.json();
    const result = await updatePackage(params.id, body);
    return json(result.body, result.status);
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params);
  return withAdmin(request, async () => {
    const result = await deletePackage(params.id);
    return json(result.body, result.status);
  });
}
