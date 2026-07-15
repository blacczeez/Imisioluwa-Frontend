import { z } from 'zod';
import { NextRequest } from 'next/server';
import { json, validationError } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import { updateOrderStatus } from '@/lib/server/services/adminService';

const schema = z.object({
  status: z.string().min(1, 'Status is required'),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAdmin(request, async () => {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return validationError(
        parsed.error.issues.map((i) => ({ msg: i.message, path: i.path.join('.') }))
      );
    }

    const result = await updateOrderStatus(params.id, parsed.data.status);
    return json(result.body, result.status);
  });
}
