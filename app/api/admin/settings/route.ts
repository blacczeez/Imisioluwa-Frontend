import { NextRequest } from 'next/server';
import { json } from '@/lib/server/http';
import { withAdmin } from '@/lib/server/auth/withAdmin';
import { getAllSettings, updateSettings } from '@/lib/server/services/settingsService';

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const result = await getAllSettings();
    return json(result.body, result.status);
  });
}

export async function PUT(request: NextRequest) {
  return withAdmin(request, async () => {
    const { settings } = await request.json();
    const result = await updateSettings(settings);
    return json(result.body, result.status);
  });
}
