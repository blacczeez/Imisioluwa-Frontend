import { prisma } from '@/lib/server/prisma';
import { logger } from '@/lib/server/utils/logger';
import { slugify } from '@/lib/server/utils/packageHelpers';
import { imageUploadService } from '@/lib/server/services/imageUploadService';
import { packageInclude, serializePackage } from '@/lib/server/services/packageService';
import type { PackageWithItems } from '@/lib/server/utils/packageHelpers';

export async function createPackage(body: {
  name_en: string;
  name_yo: string;
  problem_statement_en: string;
  description_en: string;
  description_yo: string;
  price: number;
  image_url?: string | null;
  is_active?: boolean;
  is_promoted?: boolean;
  items: Array<{ variant_id: string; quantity: number }>;
  slug?: string;
}) {
  try {
    const {
      name_en,
      name_yo,
      problem_statement_en,
      description_en,
      description_yo,
      price,
      image_url,
      is_active = true,
      is_promoted = false,
      items,
      slug: requestedSlug,
    } = body;

    const slug = requestedSlug?.trim() || slugify(name_en);
    const existing = await prisma.package.findUnique({ where: { slug } });
    if (existing) {
      return { status: 400 as const, body: { error: 'A package with this slug already exists' } };
    }

    const variantIds = items.map((item) => item.variant_id);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });

    if (variants.length !== variantIds.length) {
      return { status: 400 as const, body: { error: 'One or more variants were not found' } };
    }

    const pkg = await prisma.package.create({
      data: {
        slug,
        name_en,
        name_yo,
        problem_statement_en,
        description_en,
        description_yo,
        price,
        image_url: image_url || null,
        is_active,
        is_promoted,
        items: {
          create: items.map((item) => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
          })),
        },
      },
      include: packageInclude,
    });

    logger.info(`Package created: ${pkg.slug}`);
    return { status: 201 as const, body: serializePackage(pkg as PackageWithItems, { admin: true }) };
  } catch (err) {
    logger.error('Create package error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function updatePackage(
  id: string,
  body: {
    name_en?: string;
    name_yo?: string;
    problem_statement_en?: string;
    description_en?: string;
    description_yo?: string;
    price?: number;
    image_url?: string | null;
    is_active?: boolean;
    is_promoted?: boolean;
    items?: Array<{ variant_id: string; quantity: number }>;
    slug?: string;
  }
) {
  try {
    const {
      name_en,
      name_yo,
      problem_statement_en,
      description_en,
      description_yo,
      price,
      image_url,
      is_active,
      is_promoted,
      items,
      slug: requestedSlug,
    } = body;

    const existing = await prisma.package.findUnique({ where: { id } });
    if (!existing) {
      return { status: 404 as const, body: { error: 'Package not found' } };
    }

    const slug = requestedSlug?.trim() || existing.slug;
    if (slug !== existing.slug) {
      const slugTaken = await prisma.package.findFirst({
        where: { slug, NOT: { id } },
      });
      if (slugTaken) {
        return { status: 400 as const, body: { error: 'A package with this slug already exists' } };
      }
    }

    if (items) {
      const variantIds = items.map((item) => item.variant_id);
      const variants = await prisma.productVariant.findMany({
        where: { id: { in: variantIds } },
      });
      if (variants.length !== variantIds.length) {
        return { status: 400 as const, body: { error: 'One or more variants were not found' } };
      }

      await prisma.packageItem.deleteMany({ where: { package_id: id } });
    }

    const pkg = await prisma.package.update({
      where: { id },
      data: {
        ...(slug !== undefined ? { slug } : {}),
        ...(name_en !== undefined ? { name_en } : {}),
        ...(name_yo !== undefined ? { name_yo } : {}),
        ...(problem_statement_en !== undefined ? { problem_statement_en } : {}),
        ...(description_en !== undefined ? { description_en } : {}),
        ...(description_yo !== undefined ? { description_yo } : {}),
        ...(price !== undefined ? { price } : {}),
        ...(image_url !== undefined ? { image_url } : {}),
        ...(is_active !== undefined ? { is_active } : {}),
        ...(is_promoted !== undefined ? { is_promoted } : {}),
        ...(items
          ? {
              items: {
                create: items.map((item) => ({
                  variant_id: item.variant_id,
                  quantity: item.quantity,
                })),
              },
            }
          : {}),
      },
      include: packageInclude,
    });

    logger.info(`Package updated: ${pkg.slug}`);
    return { status: 200 as const, body: serializePackage(pkg as PackageWithItems, { admin: true }) };
  } catch (err) {
    logger.error('Update package error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function deletePackage(id: string) {
  try {
    await prisma.package.delete({ where: { id } });
    logger.info(`Package deleted: ${id}`);
    return { status: 200 as const, body: { message: 'Package deleted' } };
  } catch (err) {
    logger.error('Delete package error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function uploadPackageImage(id: string, file: File | null) {
  try {
    if (!file) {
      return { status: 400 as const, body: { error: 'Image file is required' } };
    }

    const imageUrl = await imageUploadService.saveImageFromFile(file);
    const pkg = await prisma.package.update({
      where: { id },
      data: { image_url: imageUrl },
      include: packageInclude,
    });

    return { status: 200 as const, body: serializePackage(pkg as PackageWithItems, { admin: true }) };
  } catch (err) {
    logger.error('Upload package image error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}
