export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { json } from '@/lib/server/http';
import { getPaymentMethods } from '@/lib/server/services/settingsService';

export async function GET() {
  const result = await getPaymentMethods();
  return json(result.body, result.status);
}
