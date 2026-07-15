import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/server/prisma';
import { paginate } from '@/lib/server/utils/helpers';
import { logger } from '@/lib/server/utils/logger';
import { orderEmitter, ORDER_EVENTS } from '@/lib/server/events/orderEvents';
import { buildOrderEventPayload } from '@/lib/server/utils/orderEventPayload';

export async function getDashboardStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { created_at: { gte: today } } }),
      prisma.order.aggregate({
        where: { payment_status: 'PAID' },
        _sum: { total_amount: true },
      }),
      prisma.order.aggregate({
        where: {
          payment_status: 'PAID',
          created_at: { gte: today },
        },
        _sum: { total_amount: true },
      }),
      prisma.product.count({ where: { stock_quantity: { lte: 10 } } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { created_at: 'desc' },
        include: {
          items: {
            include: { product: true },
          },
          package_items: true,
        },
      }),
    ]);

    return {
      status: 200 as const,
      body: {
        totalOrders,
        todayOrders,
        totalRevenue: totalRevenue._sum.total_amount || 0,
        todayRevenue: todayRevenue._sum.total_amount || 0,
        lowStockProducts,
        recentOrders,
      },
    };
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function getAllOrders(query: {
  page?: string | null;
  limit?: string | null;
  status?: string | null;
  payment_status?: string | null;
  search?: string | null;
}) {
  try {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    const { status, payment_status, search } = query;

    const { skip, take } = paginate(page, limit);

    const where: Prisma.OrderWhereInput = {};

    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      where.status = status as OrderStatus;
    }

    if (
      payment_status &&
      Object.values(PaymentStatus).includes(payment_status as PaymentStatus)
    ) {
      where.payment_status = payment_status as PaymentStatus;
    }

    if (search) {
      where.OR = [
        { order_number: { contains: search, mode: 'insensitive' } },
        { customer_name: { contains: search, mode: 'insensitive' } },
        { customer_email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: { product: true },
          },
          package_items: true,
        },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return { status: 200 as const, body: { orders, total, page, limit } };
  } catch (error) {
    logger.error('Get all orders error:', error);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const allowedStatuses = ['CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!allowedStatuses.includes(status)) {
      return {
        status: 400 as const,
        body: { error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` },
      };
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: {
        items: { include: { product: true, variant: true } },
        package_items: true,
      },
    });

    const payload = buildOrderEventPayload(order);

    if (status === 'OUT_FOR_DELIVERY') {
      orderEmitter.emit(ORDER_EVENTS.OUT_FOR_DELIVERY, payload);
    } else if (status === 'DELIVERED') {
      orderEmitter.emit(ORDER_EVENTS.DELIVERED, payload);
    } else if (status === 'CANCELLED') {
      orderEmitter.emit(ORDER_EVENTS.CANCELLED, payload);
    }

    logger.info(`Order status updated: ${order.order_number} -> ${status}`);
    return { status: 200 as const, body: order };
  } catch (error) {
    logger.error('Update order status error:', error);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function getInventoryStatus() {
  try {
    const lowStockProducts = await prisma.product.findMany({
      where: { stock_quantity: { lte: 10 } },
      include: { category: true },
      orderBy: { stock_quantity: 'asc' },
    });

    const outOfStockProducts = await prisma.product.findMany({
      where: { stock_quantity: 0 },
      include: { category: true },
    });

    return {
      status: 200 as const,
      body: {
        lowStockProducts,
        outOfStockProducts,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
      },
    };
  } catch (error) {
    logger.error('Get inventory status error:', error);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function getAnalytics(period: string | null) {
  try {
    const periodValue = period ?? '7d';

    const startDate = new Date();
    if (periodValue === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (periodValue === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (periodValue === '90d') {
      startDate.setDate(startDate.getDate() - 90);
    }

    const [salesData, topProducts, ordersByStatus] = await Promise.all([
      prisma.order.groupBy({
        by: ['created_at'],
        where: {
          created_at: { gte: startDate },
          payment_status: 'PAID',
        },
        _sum: { total_amount: true },
        _count: true,
      }),
      prisma.orderItem.groupBy({
        by: ['product_id'],
        _sum: { quantity: true, subtotal: true },
        _count: true,
        orderBy: {
          _sum: { subtotal: 'desc' },
        },
        take: 10,
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    return {
      status: 200 as const,
      body: {
        salesData,
        topProducts,
        ordersByStatus,
      },
    };
  } catch (error) {
    logger.error('Get analytics error:', error);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function getAllCustomers(query: {
  page?: string | null;
  limit?: string | null;
}) {
  try {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    const { skip, take } = paginate(page, limit);

    const [customers, total] = await Promise.all([
      prisma.order.groupBy({
        by: ['customer_email', 'customer_name', 'phone'],
        _count: { id: true },
        _sum: { total_amount: true },
        orderBy: { customer_email: 'asc' },
        skip,
        take,
      }),
      prisma.order
        .groupBy({
          by: ['customer_email'],
        })
        .then((result) => result.length),
    ]);

    return { status: 200 as const, body: { customers, total, page, limit } };
  } catch (error) {
    logger.error('Get all customers error:', error);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}
