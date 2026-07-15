import { NextRequest } from 'next/server';
import { logger } from '@/lib/server/utils/logger';

const GEO_HEADERS = {
  'User-Agent': 'ImisioluwaShop/1.0 (Geolocation)',
  Accept: 'application/json',
} as const;

function normalizeIp(rawIp: string): string {
  if (!rawIp) return '';
  if (rawIp.startsWith('::ffff:')) {
    return rawIp.replace('::ffff:', '');
  }
  return rawIp;
}

function isLocalOrPrivateIp(ip: string): boolean {
  if (!ip) return true;
  if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') return true;
  if (ip.startsWith('10.') || ip.startsWith('192.168.')) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
  if (ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80:')) return true;
  return false;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const rawClientIp = forwarded
    ? forwarded.split(',')[0].trim()
    : request.headers.get('x-real-ip') || '';
  return normalizeIp(rawClientIp);
}

export async function getCountryFromRequest(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    const path = clientIp && !isLocalOrPrivateIp(clientIp) ? `/${clientIp}/json/` : '/json/';
    const url = `https://ipapi.co${path}`;

    const response = await fetch(url, { headers: GEO_HEADERS });
    if (!response.ok) {
      logger.error(`Geo lookup failed: ${response.status} ${response.statusText} (${url})`);
      return { status: 200 as const, body: { countryCode: null } };
    }

    const data = (await response.json()) as {
      country_code?: string;
      ip?: string;
      reason?: string;
      error?: boolean;
    };
    const countryCode = data?.country_code ?? null;
    if (!countryCode) {
      logger.info(
        `Geo lookup returned no country_code (requestedIp=${clientIp || 'none'}, providerIp=${data?.ip || 'unknown'}, reason=${data?.reason || 'none'})`
      );
      return { status: 200 as const, body: { countryCode: null } };
    }

    return { status: 200 as const, body: { countryCode } };
  } catch (err) {
    logger.error('Geo service error:', err);
    return { status: 200 as const, body: { countryCode: null } };
  }
}
