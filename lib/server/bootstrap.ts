import { registerEmailListeners } from '@/lib/server/events/listeners/emailListener';
import { registerStockListeners } from '@/lib/server/events/listeners/stockListener';
import { registerWhatsAppListeners } from '@/lib/server/events/listeners/whatsappListener';
import { registerSSEListeners } from '@/lib/server/events/listeners/sseListener';
import { startPaymentExpiryJob } from '@/lib/server/jobs/paymentExpiry';
import { logger } from '@/lib/server/utils/logger';

let bootstrapped = false;

export function registerAll() {
  if (bootstrapped) return;
  bootstrapped = true;

  registerEmailListeners();
  registerStockListeners();
  registerWhatsAppListeners();
  registerSSEListeners();
  startPaymentExpiryJob();

  logger.info('Next API server bootstrap complete (events + payment expiry job)');
}
