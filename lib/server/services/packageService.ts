import { prisma } from '@/lib/server/prisma';
import { logger } from '@/lib/server/utils/logger';
import {
  getMaxPackageQuantity,
  getPackageStockBlockers,
  isPackageInStock,
  PackageWithItems,
} from '@/lib/server/utils/packageHelpers';

export const packageInclude = {
  items: {
    include: {
      variant: {
        include: { product: true },
      },
    },
    orderBy: { quantity: 'asc' as const },
  },
};

export function serializePackage(
  pkg: PackageWithItems,
  options?: { admin?: boolean; hideIfUnavailable?: boolean }
) {
  const inStock = isPackageInStock(pkg);
  const maxQuantity = getMaxPackageQuantity(pkg);
  const stockBlockers = getPackageStockBlockers(pkg);

  if (options?.hideIfUnavailable && (!pkg.is_active || !inStock)) {
    return null;
  }

  if (!options?.admin && !pkg.is_active) {
    return null;
  }

  return {
    ...pkg,
    in_stock: inStock,
    max_quantity: maxQuantity,
    stock_blockers: options?.admin ? stockBlockers : undefined,
    items: pkg.items.map((item) => ({
      id: item.id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      variant: {
        id: item.variant.id,
        weight_ml: item.variant.weight_ml,
        stock_quantity: item.variant.stock_quantity,
        is_active: item.variant.is_active,
        product: {
          id: item.variant.product.id,
          slug: item.variant.product.slug,
          name_en: item.variant.product.name_en,
          name_yo: item.variant.product.name_yo,
          image_urls: item.variant.product.image_urls,
          is_active: item.variant.product.is_active,
        },
      },
    })),
  };
}

export async function listPackages(query: {
  promoted?: string | null;
  include_inactive?: string | null;
}) {
  try {
    const isAdmin = query.include_inactive === 'true';

    const packages = await prisma.package.findMany({
      where: {
        ...(query.promoted === 'true' ? { is_promoted: true } : {}),
        ...(isAdmin ? {} : { is_active: true }),
      },
      include: packageInclude,
      orderBy: [{ is_promoted: 'desc' }, { created_at: 'desc' }],
    });

    const serialized = packages
      .map((pkg) =>
        serializePackage(pkg, {
          admin: isAdmin,
          hideIfUnavailable: !isAdmin,
        })
      )
      .filter(Boolean);

    return { status: 200 as const, body: serialized };
  } catch (err) {
    logger.error('Get packages error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function getPackageBySlug(slug: string) {
  try {
    const pkg = await prisma.package.findUnique({
      where: { slug },
      include: packageInclude,
    });

    if (!pkg) {
      return { status: 404 as const, body: { error: 'Package not found' } };
    }

    const serialized = serializePackage(pkg);
    if (!serialized) {
      return { status: 404 as const, body: { error: 'Package not available' } };
    }

    return { status: 200 as const, body: serialized };
  } catch (err) {
    logger.error('Get package by slug error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function getPackageById(id: string) {
  try {
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: packageInclude,
    });

    if (!pkg) {
      return { status: 404 as const, body: { error: 'Package not found' } };
    }

    return { status: 200 as const, body: serializePackage(pkg, { admin: true }) };
  } catch (err) {
    logger.error('Get package by id error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}
