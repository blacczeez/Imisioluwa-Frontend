import { orderEmitter, ORDER_EVENTS, OrderEventPayload } from '@/lib/server/events/orderEvents';

export type SSEWriter = {
  write: (chunk: string) => void;
  close?: () => void;
};

const sseClients = new Set<SSEWriter>();

export function addSSEClient(client: SSEWriter) {
  sseClients.add(client);
  return () => {
    sseClients.delete(client);
  };
}

function broadcast(event: string, data: unknown) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

export function registerSSEListeners() {
  orderEmitter.on(ORDER_EVENTS.CREATED, (payload: OrderEventPayload) => {
    broadcast('new_order', {
      orderId: payload.orderId,
      orderNumber: payload.orderNumber,
      customerName: payload.customerName,
      totalAmount: payload.totalAmount,
      paymentMethod: payload.paymentMethod,
    });
  });

  orderEmitter.on(ORDER_EVENTS.PAYMENT_CONFIRMED, (payload: OrderEventPayload) => {
    broadcast('payment_confirmed', {
      orderId: payload.orderId,
      orderNumber: payload.orderNumber,
    });
  });

  orderEmitter.on(ORDER_EVENTS.CANCELLED, (payload: OrderEventPayload) => {
    broadcast('order_cancelled', {
      orderId: payload.orderId,
      orderNumber: payload.orderNumber,
    });
  });
}
