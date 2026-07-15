export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import { uploadPackageImage } from '@/lib/server/services/packageWriteService';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params);
  return withAdmin(request, async () => {
    const form = await request.formData();
    const file = form.get('image');
    const imageFile = file instanceof File ? file : null;
    const result = await uploadPackageImage(params.id, imageFile);
    return json(result.body, result.status);
  });
}
