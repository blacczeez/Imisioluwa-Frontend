'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/context/ToastContext';
import { SIMULATED_ORDER_CUSTOMERS } from '@/lib/simulated-order-customers';

const DEFAULT_INTERVAL_MS = 60_000;
const MIN_INTERVAL_MS = 5_000;

function parseIntervalMs(): number {
  const raw = process.env.NEXT_PUBLIC_SIMULATE_ORDERS_INTERVAL_MS;
  if (raw == null || raw === '') return DEFAULT_INTERVAL_MS;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < MIN_INTERVAL_MS) return DEFAULT_INTERVAL_MS;
  return n;
}

export default function OrderActivitySimulator() {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const indexRef = useRef(0);

  useEffect(() => {
    const enabled = process.env.NEXT_PUBLIC_SIMULATE_ORDERS === 'true';
    if (!enabled || SIMULATED_ORDER_CUSTOMERS.length === 0) return;

    const intervalMs = parseIntervalMs();

    const tick = () => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

      const customer = SIMULATED_ORDER_CUSTOMERS[indexRef.current % SIMULATED_ORDER_CUSTOMERS.length];
      indexRef.current += 1;

      showToast(t('simulate_order_toast', { name: customer.firstName }), 'info');
    };

    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [showToast, t]);

  return null;
}
