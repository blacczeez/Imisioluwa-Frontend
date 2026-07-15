export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import {
  requireAuthFromQueryToken,
  authErrorResponse,
} from '@/lib/server/auth/requireAuth';
import { addSSEClient } from '@/lib/server/events/listeners/sseListener';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  try {
    requireAuthFromQueryToken(token);
  } catch (err) {
    return authErrorResponse(err);
  }

  const encoder = new TextEncoder();
  let removeClient: (() => void) | undefined;
  let keepAliveInterval: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('event: connected\ndata: {}\n\n'));

      removeClient = addSSEClient({
        write: (chunk) => controller.enqueue(encoder.encode(chunk)),
      });

      keepAliveInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(':keepalive\n\n'));
        } catch {
          if (keepAliveInterval) clearInterval(keepAliveInterval);
        }
      }, 30000);
    },
    cancel() {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      if (removeClient) removeClient();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
