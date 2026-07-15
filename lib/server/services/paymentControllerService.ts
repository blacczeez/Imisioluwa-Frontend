import { prisma } from '@/lib/server/prisma';
import { paymentService } from '@/lib/server/services/paymentService';
import { stripeService } from '@/lib/server/services/stripeService';
import { logger } from '@/lib/server/utils/logger';
import { orderEmitter, ORDER_EVENTS } from '@/lib/server/events/orderEvents';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPaymentPayload(order: any) {
  return {
    orderId: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    phone: order.phone,
    deliveryAddress: order.delivery_address,
    totalAmount: order.total_amount,
    paymentMethod: order.payment_method || 'online',
    items: order.items.map((item: { product_id: string; product?: { name_en: string }; quantity: number; unit_price: number; subtotal: number }) => ({
      productId: item.product_id,
      productName: item.product?.name_en || '',
      quantity: item.quantity,
      unitPrice: item.unit_price,
      subtotal: item.subtotal,
    })),
  };
}

export async function initializePayment(body: {
  orderId: string;
  email: string;
  amount: number;
}) {
  try {
    const { orderId, email, amount } = body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return { status: 404 as const, body: { error: 'Order not found' } };
    }

    if (order.status !== 'PENDING_PAYMENT') {
      return { status: 400 as const, body: { error: 'Order is not awaiting payment' } };
    }

    const currency = order.currency || 'NGN';

    if (currency === 'NGN') {
      const paymentData = await paymentService.initializePayment(email, amount, orderId);
      await prisma.order.update({
        where: { id: orderId },
        data: { payment_gateway: 'paystack' },
      });
      logger.info(`Paystack payment initialized for order: ${order.order_number}`);
      return { status: 200 as const, body: { gateway: 'paystack', ...paymentData } };
    }

    const lineItems = order.items.map((item) => ({
      name: item.product?.name_en || 'Product',
      quantity: item.quantity,
      unitPrice: item.unit_price,
    }));

    if (order.shipping_cost > 0) {
      lineItems.push({
        name: 'Shipping',
        quantity: 1,
        unitPrice: order.shipping_cost,
      });
    }

    const sessionData = await stripeService.createCheckoutSession(
      orderId,
      email,
      amount,
      currency,
      lineItems
    );

    await prisma.order.update({
      where: { id: orderId },
      data: { payment_gateway: 'stripe' },
    });

    logger.info(`Stripe session created for order: ${order.order_number}`);
    return { status: 200 as const, body: { gateway: 'stripe', ...sessionData } };
  } catch (error) {
    logger.error('Initialize payment error:', error);
    return { status: 500 as const, body: { error: 'Payment initialization failed' } };
  }
}

export async function verifyPaystack(body: { reference: string }) {
  try {
    const { reference } = body;

    const paymentData = await paymentService.verifyPayment(reference);

    if (paymentData.status === 'success') {
      const orderId = paymentData.metadata.order_id;

      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          payment_status: 'PAID',
          payment_reference: reference,
          status: 'CONFIRMED',
        },
        include: { items: { include: { product: true } } },
      });

      await prisma.payment.create({
        data: {
          order_id: orderId,
          amount: paymentData.amount / 100,
          payment_reference: reference,
          gateway_response: paymentData,
          status: 'PAID',
        },
      });

      orderEmitter.emit(ORDER_EVENTS.PAYMENT_CONFIRMED, buildPaymentPayload(order));

      logger.info(`Paystack payment verified for order: ${order.order_number}`);
      return { status: 200 as const, body: { message: 'Payment verified', order } };
    }

    return { status: 400 as const, body: { error: 'Payment verification failed' } };
  } catch (error) {
    logger.error('Verify Paystack payment error:', error);
    return { status: 500 as const, body: { error: 'Payment verification failed' } };
  }
}

export async function stripeWebhook(rawBody: Buffer, signature: string | null) {
  try {
    if (!signature) {
      return { status: 400 as const, body: { error: 'Webhook error' } };
    }

    const event = stripeService.verifyWebhookEvent(rawBody, signature);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;
      if (!orderId) {
        return { status: 400 as const, body: { error: 'Webhook error' } };
      }

      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          payment_status: 'PAID',
          payment_reference: session.id,
          status: 'CONFIRMED',
        },
        include: { items: { include: { product: true } } },
      });

      await prisma.payment.create({
        data: {
          order_id: orderId,
          amount: (session.amount_total ?? 0) / 100,
          payment_reference: session.id,
          gateway_response: session as object,
          status: 'PAID',
        },
      });

      orderEmitter.emit(ORDER_EVENTS.PAYMENT_CONFIRMED, buildPaymentPayload(order));

      logger.info(`Stripe payment confirmed for order: ${order.order_number}`);
    }

    return { status: 200 as const, body: { received: true } };
  } catch (error) {
    logger.error('Stripe webhook error:', error);
    return { status: 400 as const, body: { error: 'Webhook error' } };
  }
}

export async function verifyStripe(body: { sessionId: string }) {
  try {
    const { sessionId } = body;
    const session = await stripeService.retrieveSession(sessionId);

    if (session.payment_status === 'paid') {
      const orderId = session.metadata?.order_id;
      const order = await prisma.order.findUnique({ where: { id: orderId } });

      return { status: 200 as const, body: { message: 'Payment verified', order } };
    }

    return { status: 400 as const, body: { error: 'Payment not completed' } };
  } catch (error) {
    logger.error('Verify Stripe session error:', error);
    return { status: 500 as const, body: { error: 'Verification failed' } };
  }
}

export async function getPaymentsByOrderId(orderId: string) {
  try {
    const payments = await prisma.payment.findMany({
      where: { order_id: orderId },
      orderBy: { created_at: 'desc' },
    });

    return { status: 200 as const, body: payments };
  } catch (error) {
    logger.error('Get payments error:', error);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}
