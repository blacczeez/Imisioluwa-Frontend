import { orderEmitter, ORDER_EVENTS, OrderEventPayload } from '@/lib/server/events/orderEvents';
import { emailService } from '@/lib/server/services/emailService';
import { logger } from '@/lib/server/utils/logger';

export function registerEmailListeners() {
  orderEmitter.on(ORDER_EVENTS.CREATED, async (payload: OrderEventPayload) => {
    try {
      await emailService.sendOrderConfirmation(
        payload.customerEmail,
        payload.orderNumber,
        payload.customerName,
        payload.totalAmount
      );
      await emailService.sendAdminNewOrderAlert(payload.orderNumber, payload.totalAmount);
    } catch (error) {
      logger.error('Email listener error (order.created):', error);
    }
  });

  orderEmitter.on(ORDER_EVENTS.PAYMENT_CONFIRMED, async (payload: OrderEventPayload) => {
    try {
      await emailService.sendOrderStatusUpdate(
        payload.customerEmail,
        payload.orderNumber,
        payload.customerName,
        'Confirmed - Payment Received'
      );
    } catch (error) {
      logger.error('Email listener error (payment_confirmed):', error);
    }
  });

  orderEmitter.on(ORDER_EVENTS.DELIVERED, async (payload: OrderEventPayload) => {
    try {
      await emailService.sendOrderStatusUpdate(
        payload.customerEmail,
        payload.orderNumber,
        payload.customerName,
        'Delivered'
      );
    } catch (error) {
      logger.error('Email listener error (delivered):', error);
    }
  });

  orderEmitter.on(ORDER_EVENTS.CANCELLED, async (payload: OrderEventPayload) => {
    try {
      await emailService.sendOrderStatusUpdate(
        payload.customerEmail,
        payload.orderNumber,
        payload.customerName,
        'Cancelled'
      );
    } catch (error) {
      logger.error('Email listener error (cancelled):', error);
    }
  });
}
