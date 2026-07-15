import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { jwtConfig } from '@/lib/server/config/jwt';
import { prisma } from '@/lib/server/prisma';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export class AuthError extends Error {
  status: number;
  body: Record<string, unknown>;

  constructor(status: number, body: Record<string, unknown>) {
    super(typeof body.error === 'string' ? body.error : 'Auth error');
    this.status = status;
    this.body = body;
  }
}

export function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim() || null;
}

export function verifyAccessToken(token: string): AuthUser {
  const decoded = jwt.verify(token, jwtConfig.secret) as AuthUser;
  return {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  };
}

/** Verify JWT from Authorization header. Throws AuthError on failure. */
export function requireAuth(request: NextRequest): AuthUser {
  const token = getBearerToken(request);
  if (!token) {
    throw new AuthError(401, { error: 'Authentication required' });
  }
  try {
    return verifyAccessToken(token);
  } catch {
    throw new AuthError(401, { error: 'Invalid token' });
  }
}

/** requireAuth + ADMIN role + AdminUser row. */
export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
  const user = requireAuth(request);

  if (user.role !== 'ADMIN') {
    throw new AuthError(403, { error: 'Admin access required' });
  }

  const adminUser = await prisma.adminUser.findUnique({
    where: { user_id: user.id },
  });

  if (!adminUser) {
    throw new AuthError(403, { error: 'Admin access required' });
  }

  return user;
}

/** SSE uses ?token= because EventSource cannot set Authorization. */
export function requireAuthFromQueryToken(token: string | null): AuthUser {
  if (!token) {
    throw new AuthError(401, { error: 'Authentication required' });
  }
  try {
    return verifyAccessToken(token);
  } catch {
    throw new AuthError(401, { error: 'Invalid token' });
  }
}

export function authErrorResponse(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json(err.body, { status: err.status });
  }
  return NextResponse.json({ error: 'Server error' }, { status: 500 });
}

export function signAccessToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ id: userId }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });
}
