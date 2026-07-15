import { prisma } from '@/lib/server/prisma';
import { generateOrderNumber } from '@/lib/server/utils/helpers';
import { logger } from '@/lib/server/utils/logger';
import { orderEmitter, ORDER_EVENTS } from '@/lib/server/events/orderEvents';
import { getNigeriaLgaDefaultShippingPrice } from '@/lib/server/utils/nigeriaShipping';
import {
  buildContentsSnapshot,
  getMaxPackageQuantity,
  isPackageInStock,
} from '@/lib/server/utils/packageHelpers';
import { buildOrderEventPayload } from '@/lib/server/utils/orderEventPayload';

export interface CreateOrderItem {
  product_id?: string;
  variant_id?: string;
  package_id?: string;
  quantity: number;
}

export interface CreateOrderBody {
  customer_name: string;
  customer_email: string;
  phone: string;
  delivery_address: string;
  notes?: string;
  items: CreateOrderItem[];
  payment_method: 'online' | 'cod';
  currency?: string;
  country?: string;
  shipping_state?: string;
  shipping_lga?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getProductPrice(product: any, currency: string): number | null {
  switch (currency) {
    case 'USD':
      return product.price_usd;
    case 'GBP':
      return product.price_gbp;
    case 'EUR':
      return product.price_eur;
    default:
      return product.price;
  }
}

export async function createOrder(body: CreateOrderBody) {
  try {
    const {
      customer_name,
      customer_email,
      phone,
      delivery_address,
      notes,
      items,
      payment_method,
      currency,
      country,
      shipping_state,
      shipping_lga,
    } = body;

    if (!items || items.length === 0) {
      return { status: 400 as const, body: { error: 'Order items are required' } };
    }

    if (!payment_method || !['online', 'cod'].includes(payment_method)) {
      return {
        status: 400 as const,
        body: { error: 'Valid payment method is required (online or cod)' },
      };
    }

    const validCurrencies = ['NGN', 'USD', 'GBP', 'EUR'];
    const orderCurrency =
      currency && validCurrencies.includes(currency.toUpperCase())
        ? currency.toUpperCase()
        : 'NGN';

    if (payment_method === 'cod' && orderCurrency !== 'NGN') {
      return {
        status: 400 as const,
        body: { error: 'Pay on delivery is only available for orders in Naira' },
      };
    }

    const methodKey =
      payment_method === 'online' ? 'payment_online_enabled' : 'payment_cod_enabled';
    const setting = await prisma.setting.findUnique({ where: { key: methodKey } });
    if (setting && setting.value === 'false') {
      return {
        status: 400 as const,
        body: { error: 'This payment method is not currently available' },
      };
    }

    let total_amount = 0;
    const orderItems: Array<{
      product_id: string;
      variant_id?: string;
      quantity: number;
      unit_price: number;
      subtotal: number;
    }> = [];
    const orderPackageItems: Array<{
      package_id: string;
      package_name: string;
      quantity: number;
      unit_price: number;
      subtotal: number;
      contents_snapshot: Array<{ variant_id: string; product_id: string; quantity: number }>;
      stockEntries: Array<{ variant_id: string; product_id: string; quantity: number }>;
    }> = [];

    for (const item of items) {
      if (item.package_id) {
        if (orderCurrency !== 'NGN') {
          return {
            status: 400 as const,
            body: { error: 'Packages are only available for orders in Naira' },
          };
        }

        const pkg = await prisma.package.findUnique({
          where: { id: item.package_id },
          include: {
            items: {
              include: {
                variant: { include: { product: true } },
              },
            },
          },
        });

        if (!pkg || !pkg.is_active) {
          return { status: 404 as const, body: { error: 'Package not found' } };
        }

        if (!isPackageInStock(pkg)) {
          return {
            status: 400 as const,
            body: { error: `${pkg.name_en} is currently out of stock` },
          };
        }

        const maxQuantity = getMaxPackageQuantity(pkg);
        if (item.quantity > maxQuantity) {
          return {
            status: 400 as const,
            body: { error: `Insufficient stock for ${pkg.name_en}` },
          };
        }

        const unitPrice = pkg.price;
        const subtotal = unitPrice * item.quantity;
        total_amount += subtotal;

        const contentsSnapshot = buildContentsSnapshot(pkg);
        orderPackageItems.push({
          package_id: pkg.id,
          package_name: pkg.name_en,
          quantity: item.quantity,
          unit_price: unitPrice,
          subtotal,
          contents_snapshot: contentsSnapshot,
          stockEntries: contentsSnapshot.map((entry) => ({
            ...entry,
            quantity: entry.quantity * item.quantity,
          })),
        });
        continue;
      }

      const variantId = item.variant_id;
      const productId = item.product_id;

      const variant = variantId
        ? await prisma.productVariant.findUnique({
            where: { id: variantId },
            include: { product: true },
          })
        : null;

      const product = variant
        ? variant.product
        : productId
          ? await prisma.product.findUnique({
              where: { id: productId },
            })
          : null;

      if (!product) {
        return { status: 404 as const, body: { error: 'Product not found for order item' } };
      }

      const availableStock = variant ? variant.stock_quantity : product.stock_quantity;
      if (availableStock < item.quantity) {
        return {
          status: 400 as const,
          body: { error: `Insufficient stock for ${product.name_en}` },
        };
      }

      const price = variant
        ? getProductPrice(variant, orderCurrency)
        : getProductPrice(product, orderCurrency);
      if (price === null || price === undefined) {
        return {
          status: 400 as const,
          body: { error: `${product.name_en} is not available in ${orderCurrency}` },
        };
      }

      const subtotal = price * item.quantity;
      total_amount += subtotal;

      orderItems.push({
        product_id: product.id,
        ...(variant ? { variant_id: variant.id } : {}),
        quantity: item.quantity,
        unit_price: price,
        subtotal,
      });
    }

    let shipping_cost = 0;
    if (country) {
      const countryCode = country.toUpperCase();
      if (countryCode === 'NG') {
        if (!shipping_state || !shipping_lga) {
          return {
            status: 400 as const,
            body: {
              error: 'State and local government are required for Nigeria shipping',
            },
          };
        }

        const nigeriaRate = await prisma.nigeriaLgaShippingRate.findFirst({
          where: {
            state: shipping_state,
            lga: shipping_lga,
            is_active: true,
          },
        });

        if (nigeriaRate) {
          shipping_cost = nigeriaRate.price;
        } else {
          const defaultPrice = await getNigeriaLgaDefaultShippingPrice();
          if (defaultPrice === null) {
            return {
              status: 400 as const,
              body: {
                error:
                  'Shipping is not set for this LGA. Add a price for it in admin or set a default Nigeria shipping amount.',
              },
            };
          }
          shipping_cost = defaultPrice;
        }
      } else {
        const zone =
          (await prisma.shippingZone.findFirst({
            where: { is_active: true, countries: { has: countryCode } },
          })) ||
          (await prisma.shippingZone.findFirst({
            where: { is_active: true, countries: { has: '*' } },
          }));

        if (zone) {
          shipping_cost = zone.flat_rate;
          if (zone.free_shipping_above && total_amount >= zone.free_shipping_above) {
            shipping_cost = 0;
          }
        }
      }
    }

    const initialStatus = payment_method === 'online' ? 'PENDING_PAYMENT' : 'CONFIRMED';

    const order = await prisma.order.create({
      data: {
        order_number: generateOrderNumber(),
        customer_name,
        customer_email,
        phone,
        delivery_address,
        notes,
        total_amount: total_amount + shipping_cost,
        status: initialStatus,
        payment_method,
        currency: orderCurrency,
        country: country?.toUpperCase() || null,
        shipping_state: shipping_state || null,
        shipping_lga: shipping_lga || null,
        shipping_cost,
        items: {
          create: orderItems,
        },
        ...(orderPackageItems.length > 0
          ? {
              package_items: {
                create: orderPackageItems.map(({ stockEntries, ...entry }) => entry),
              },
            }
          : {}),
      },
      include: {
        items: {
          include: { product: true, variant: true },
        },
        package_items: true,
      },
    });

    for (const item of orderItems) {
      if (item.variant_id) {
        await prisma.productVariant.update({
          where: { id: item.variant_id },
          data: { stock_quantity: { decrement: item.quantity } },
        });
      } else {
        await prisma.product.update({
          where: { id: item.product_id },
          data: { stock_quantity: { decrement: item.quantity } },
        });
      }

      await prisma.inventoryLog.create({
        data: {
          product_id: item.product_id,
          change_type: 'SALE',
          quantity_change: -item.quantity,
          notes: `Order ${order.order_number}`,
        },
      });
    }

    for (const packageItem of orderPackageItems) {
      for (const entry of packageItem.stockEntries) {
        await prisma.productVariant.update({
          where: { id: entry.variant_id },
          data: { stock_quantity: { decrement: entry.quantity } },
        });

        await prisma.inventoryLog.create({
          data: {
            product_id: entry.product_id,
            change_type: 'SALE',
            quantity_change: -entry.quantity,
            notes: `Order ${order.order_number} (${packageItem.package_name})`,
          },
        });
      }
    }

    const payload = buildOrderEventPayload(order, payment_method);
    orderEmitter.emit(ORDER_EVENTS.CREATED, payload);

    logger.info(`Order created: ${order.order_number} (${payment_method}, ${orderCurrency})`);
    return { status: 201 as const, body: order };
  } catch (error) {
    logger.error('Create order error:', error);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function trackOrder(orderNumber: string | null, phone: string | null) {
  try {
    if (!orderNumber || !phone) {
      return {
        status: 400 as const,
        body: { error: 'Order number and phone are required' },
      };
    }

    const order = await prisma.order.findFirst({
      where: {
        order_number: orderNumber,
        phone,
      },
      include: {
        items: { include: { product: true, variant: true } },
        package_items: true,
        deliveries: true,
      },
    });

    if (!order) {
      return { status: 404 as const, body: { error: 'Order not found' } };
    }

    return { status: 200 as const, body: order };
  } catch (error) {
    logger.error('Track order error:', error);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, variant: true } },
        package_items: true,
        deliveries: true,
      },
    });

    if (!order) {
      return { status: 404 as const, body: { error: 'Order not found' } };
    }

    return { status: 200 as const, body: order };
  } catch (error) {
    logger.error('Get order error:', error);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}
