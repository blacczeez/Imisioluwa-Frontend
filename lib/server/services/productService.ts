import { prisma } from '@/lib/server/prisma';
import { paginate } from '@/lib/server/utils/helpers';
import { logger } from '@/lib/server/utils/logger';

export async function listProducts(query: {
  page?: string | null;
  limit?: string | null;
  category?: string | null;
  search?: string | null;
  is_active?: string | null;
  include_out_of_stock?: string | null;
  include_inactive?: string | null;
}) {
  try {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const { skip, take } = paginate(page, limit);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (query.include_inactive !== 'true') {
      where.is_active = (query.is_active || 'true') === 'true';
    }

    if (query.include_out_of_stock !== 'true') {
      where.stock_quantity = { gt: 0 };
    }

    if (query.category) {
      where.category_id = query.category;
    }

    if (query.search) {
      where.OR = [
        { name_en: { contains: query.search, mode: 'insensitive' } },
        { name_yo: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: { orderBy: { weight_ml: 'asc' } },
        },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return { status: 200 as const, body: { products, total, page, limit } };
  } catch (err) {
    logger.error('Get products error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: { orderBy: { weight_ml: 'asc' } },
      },
    });

    if (!product) {
      return { status: 404 as const, body: { error: 'Product not found' } };
    }

    return { status: 200 as const, body: product };
  } catch (err) {
    logger.error('Get product error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    let product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: { orderBy: { weight_ml: 'asc' } },
      },
    });

    if (!product) {
      product = await prisma.product.findFirst({
        where: {
          slug: { equals: slug, mode: 'insensitive' },
        },
        include: {
          category: true,
          variants: { orderBy: { weight_ml: 'asc' } },
        },
      });
    }

    if (!product && isUuid) {
      product = await prisma.product.findUnique({
        where: { id: slug },
        include: {
          category: true,
          variants: { orderBy: { weight_ml: 'asc' } },
        },
      });
    }

    if (!product) {
      return { status: 404 as const, body: { error: 'Product not found' } };
    }

    return { status: 200 as const, body: product };
  } catch (err) {
    logger.error('Get product by slug error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}
