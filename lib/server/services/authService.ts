import bcrypt from 'bcrypt';
import { prisma } from '@/lib/server/prisma';
import { logger } from '@/lib/server/utils/logger';
import { signAccessToken, signRefreshToken } from '@/lib/server/auth/requireAuth';

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
  phone: string;
}) {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingUser) {
    return { status: 400 as const, body: { error: 'User already exists' } };
  }

  const password_hash = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      password_hash,
      name: input.name,
      phone: input.phone,
      role: 'CUSTOMER',
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      created_at: true,
    },
  });

  const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
  logger.info(`User registered: ${input.email}`);
  return { status: 201 as const, body: { user, token } };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    return { status: 401 as const, body: { error: 'Invalid credentials' } };
  }

  const isValidPassword = await bcrypt.compare(input.password, user.password_hash);
  if (!isValidPassword) {
    return { status: 401 as const, body: { error: 'Invalid credentials' } };
  }

  const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken(user.id);

  logger.info(`User logged in: ${input.email}`);
  return {
    status: 200 as const,
    body: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      token,
      refreshToken,
    },
  };
}

export async function adminLogin(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { admin_user: true },
  });

  if (!user || user.role !== 'ADMIN' || !user.admin_user) {
    return { status: 401 as const, body: { error: 'Invalid admin credentials' } };
  }

  const isValidPassword = await bcrypt.compare(input.password, user.password_hash);
  if (!isValidPassword) {
    return { status: 401 as const, body: { error: 'Invalid admin credentials' } };
  }

  const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
  logger.info(`Admin logged in: ${input.email}`);
  return {
    status: 200 as const,
    body: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        adminRole: user.admin_user.role,
      },
      token,
    },
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      created_at: true,
    },
  });

  if (!user) {
    return { status: 404 as const, body: { error: 'User not found' } };
  }

  return { status: 200 as const, body: user };
}
