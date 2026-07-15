export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { json, apiError } from '@/lib/server/http';
import { requireAuth, authErrorResponse, AuthError } from '@/lib/server/auth/requireAuth';
import { getMe } from '@/lib/server/services/authService';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const result = await getMe(user.id);
    return json(result.body, result.status);
  } catch (err) {
    if (err instanceof AuthError) return authErrorResponse(err);
    console.error('Get user error:', err);
    return apiError('Server error', 500);
  }
}
