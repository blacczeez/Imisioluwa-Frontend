import { z } from 'zod';
import { NextRequest } from 'next/server';
import { json, validationError, apiError } from '@/lib/server/http';
import { createOrder } from '@/lib/server/services/orderService';

const orderItemSchema = z.object({
  product_id: z.string().optional(),
  variant_id: z.string().optional(),
  package_id: z.string().optional(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  delivery_address: z.string().min(1, 'Delivery address is required'),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Order items are required'),
  payment_method: z.enum(['online', 'cod'], {
    errorMap: () => ({ message: 'Payment method must be online or cod' }),
  }),
  currency: z.enum(['NGN', 'USD', 'GBP', 'EUR']).optional(),
  country: z.string().length(2, 'Country must be ISO 2-letter code').optional(),
  shipping_state: z.string().optional(),
  shipping_lga: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(
        parsed.error.issues.map((i) => ({ msg: i.message, path: i.path.join('.') }))
      );
    }

    const result = await createOrder(parsed.data);
    return json(result.body, result.status);
  } catch (err) {
    console.error('Create order error:', err);
    return apiError('Server error', 500);
  }
}
