import { NextRequest, NextResponse } from 'next/server';
import {
  requireAdmin,
  authErrorResponse,
  AuthError,
  AuthUser,
} from '@/lib/server/auth/requireAuth';
import { apiError } from '@/lib/server/http';

export async function withAdmin(
  request: NextRequest,
  handler: (user: AuthUser) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const user = await requireAdmin(request);
    return await handler(user);
  } catch (err) {
    if (err instanceof AuthError) return authErrorResponse(err);
    console.error('Admin route error:', err);
    return apiError('Server error', 500);
  }
}
