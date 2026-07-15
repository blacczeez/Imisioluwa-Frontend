import { prisma } from '@/lib/server/prisma';
import { logger } from '@/lib/server/utils/logger';

export async function getAllSettings() {
  try {
    const settings = await prisma.setting.findMany();
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return { status: 200 as const, body: result };
  } catch (err) {
    logger.error('Get settings error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function updateSettings(settings: Record<string, string>) {
  try {
    const onlineEnabled = settings.payment_online_enabled ?? 'true';
    const codEnabled = settings.payment_cod_enabled ?? 'true';
    if (onlineEnabled === 'false' && codEnabled === 'false') {
      return {
        status: 400 as const,
        body: { error: 'At least one payment method must be enabled' },
      };
    }

    for (const [key, value] of Object.entries(settings)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    return { status: 200 as const, body: { message: 'Settings updated' } };
  } catch (err) {
    logger.error('Update settings error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function getPaymentMethods() {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: { in: ['payment_online_enabled', 'payment_cod_enabled'] },
      },
    });

    const result: Record<string, boolean> = {
      online: true,
      cod: true,
    };

    for (const s of settings) {
      if (s.key === 'payment_online_enabled') result.online = s.value === 'true';
      if (s.key === 'payment_cod_enabled') result.cod = s.value === 'true';
    }

    return { status: 200 as const, body: result };
  } catch (err) {
    logger.error('Get payment methods error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}
