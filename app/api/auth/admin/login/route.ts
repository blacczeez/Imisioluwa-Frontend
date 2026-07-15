import { z } from 'zod';
import { NextRequest } from 'next/server';
import { json, validationError, apiError } from '@/lib/server/http';
import { adminLogin } from '@/lib/server/services/authService';

const schema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return validationError(
        parsed.error.issues.map((i) => ({ msg: i.message, path: i.path.join('.') }))
      );
    }

    const result = await adminLogin(parsed.data);
    return json(result.body, result.status);
  } catch (err) {
    console.error('Admin login error:', err);
    return apiError('Server error', 500);
  }
}
