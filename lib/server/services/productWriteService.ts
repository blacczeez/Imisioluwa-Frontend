import { prisma } from '@/lib/server/prisma';
import { slugify } from '@/lib/server/utils/helpers';
import { logger } from '@/lib/server/utils/logger';
import { imageUploadService } from '@/lib/server/services/imageUploadService';

const parseOptionalFloat = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseOptionalInt = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

type VariantInput = {
  id?: string;
  weight_ml?: number | string;
  price?: number | string;
  price_usd?: number | string;
  price_gbp?: number | string;
  price_eur?: number | string;
  stock_quantity?: number | string;
  is_active?: boolean;
};

const normalizeVariants = (variantsRaw: unknown) => {
  if (!Array.isArray(variantsRaw)) return [];

  return (variantsRaw as VariantInput[])
    .map((variant) => {
      const weight_ml = parseOptionalInt(variant.weight_ml);
      const price = parseOptionalFloat(variant.price);
      const stock_quantity = parseOptionalInt(variant.stock_quantity) ?? 0;
      if (!weight_ml || weight_ml <= 0 || price === undefined || price <= 0) return null;
      return {
        id: variant.id,
        weight_ml,
        price,
        price_usd: parseOptionalFloat(variant.price_usd),
        price_gbp: parseOptionalFloat(variant.price_gbp),
        price_eur: parseOptionalFloat(variant.price_eur),
        stock_quantity,
        is_active: variant.is_active ?? true,
      };
    })
    .filter((variant): variant is NonNullable<typeof variant> => Boolean(variant));
};

const productInclude = {
  category: true,
  variants: { orderBy: { weight_ml: 'asc' as const } },
};

export async function createProduct(body: {
  name_en: string;
  name_yo: string;
  description_en: string;
  description_yo: string;
  variants: unknown;
  category_id: string;
  is_active?: boolean;
}) {
  try {
    const { name_en, name_yo, description_en, description_yo, variants, category_id, is_active } =
      body;

    const normalizedVariants = normalizeVariants(variants);
    if (normalizedVariants.length === 0) {
      return { status: 400 as const, body: { error: 'At least one valid variant is required' } };
    }

    const primaryVariant = [...normalizedVariants].sort((a, b) => a.weight_ml - b.weight_ml)[0];

    let slug = slugify(name_en);
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const product = await prisma.product.create({
      data: {
        name_en,
        name_yo,
        description_en,
        description_yo,
        price: primaryVariant.price,
        ...(primaryVariant.price_usd !== undefined && { price_usd: primaryVariant.price_usd }),
        ...(primaryVariant.price_gbp !== undefined && { price_gbp: primaryVariant.price_gbp }),
        ...(primaryVariant.price_eur !== undefined && { price_eur: primaryVariant.price_eur }),
        weight_kg: primaryVariant.weight_ml / 1000,
        category_id,
        stock_quantity: primaryVariant.stock_quantity,
        image_urls: [],
        slug,
        ...(is_active !== undefined && { is_active }),
        variants: {
          create: normalizedVariants.map((variant) => ({
            weight_ml: variant.weight_ml,
            price: variant.price,
            ...(variant.price_usd !== undefined && { price_usd: variant.price_usd }),
            ...(variant.price_gbp !== undefined && { price_gbp: variant.price_gbp }),
            ...(variant.price_eur !== undefined && { price_eur: variant.price_eur }),
            stock_quantity: variant.stock_quantity,
            is_active: variant.is_active,
          })),
        },
      },
      include: productInclude,
    });

    logger.info(`Product created: ${product.id}`);
    return { status: 201 as const, body: product };
  } catch (err) {
    logger.error('Create product error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function updateProduct(
  id: string,
  body: {
    name_en?: string;
    name_yo?: string;
    description_en?: string;
    description_yo?: string;
    variants?: unknown;
    category_id?: string;
    is_active?: boolean;
  }
) {
  try {
    const { name_en, name_yo, description_en, description_yo, variants, category_id, is_active } =
      body;

    const normalizedVariants = normalizeVariants(variants);
    if (normalizedVariants.length === 0) {
      return { status: 400 as const, body: { error: 'At least one valid variant is required' } };
    }

    let slugData: { slug?: string } = {};
    if (name_en) {
      let slug = slugify(name_en);
      const existingSlug = await prisma.product.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existingSlug) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
      slugData = { slug };
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name_en && { name_en }),
        ...(name_yo && { name_yo }),
        ...(description_en && { description_en }),
        ...(description_yo && { description_yo }),
        ...(category_id && { category_id }),
        ...(is_active !== undefined && { is_active }),
        ...slugData,
      },
      include: productInclude,
    });

    const existingVariants = await prisma.productVariant.findMany({
      where: { product_id: id },
      select: { id: true },
    });
    const incomingIds = new Set(
      normalizedVariants.map((variant) => variant.id).filter(Boolean) as string[]
    );

    await prisma.productVariant.deleteMany({
      where: {
        product_id: id,
        id: { notIn: Array.from(incomingIds) },
      },
    });

    for (const variant of normalizedVariants) {
      if (variant.id && existingVariants.some((existing) => existing.id === variant.id)) {
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: {
            weight_ml: variant.weight_ml,
            price: variant.price,
            price_usd: variant.price_usd,
            price_gbp: variant.price_gbp,
            price_eur: variant.price_eur,
            stock_quantity: variant.stock_quantity,
            is_active: variant.is_active,
          },
        });
      } else {
        await prisma.productVariant.create({
          data: {
            product_id: id,
            weight_ml: variant.weight_ml,
            price: variant.price,
            price_usd: variant.price_usd,
            price_gbp: variant.price_gbp,
            price_eur: variant.price_eur,
            stock_quantity: variant.stock_quantity,
            is_active: variant.is_active,
          },
        });
      }
    }

    const refreshedVariants = await prisma.productVariant.findMany({
      where: { product_id: id, is_active: true },
      orderBy: { weight_ml: 'asc' },
    });
    const primaryVariant = refreshedVariants[0] || normalizedVariants[0];
    if (primaryVariant) {
      await prisma.product.update({
        where: { id },
        data: {
          price: primaryVariant.price,
          price_usd: primaryVariant.price_usd,
          price_gbp: primaryVariant.price_gbp,
          price_eur: primaryVariant.price_eur,
          stock_quantity: primaryVariant.stock_quantity,
          weight_kg: primaryVariant.weight_ml / 1000,
        },
      });
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });

    logger.info(`Product updated: ${product.id}`);
    return { status: 200 as const, body: updatedProduct ?? product };
  } catch (err) {
    logger.error('Update product error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return { status: 404 as const, body: { error: 'Product not found' } };
    }

    if (product.image_urls.length > 0) {
      await imageUploadService.deleteMultipleImages(product.image_urls);
    }

    await prisma.product.delete({ where: { id } });

    logger.info(`Product deleted: ${id}`);
    return { status: 200 as const, body: { message: 'Product deleted successfully' } };
  } catch (err) {
    logger.error('Delete product error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function uploadProductImages(id: string, files: File[]) {
  try {
    if (!files || files.length === 0) {
      return { status: 400 as const, body: { error: 'No files uploaded' } };
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return { status: 404 as const, body: { error: 'Product not found' } };
    }

    const imageUrls = await Promise.all(
      files.map((file) => imageUploadService.saveImageFromFile(file))
    );
    const updatedImageUrls = [...product.image_urls, ...imageUrls];

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { image_urls: updatedImageUrls },
    });

    logger.info(`Images uploaded for product: ${id}`);
    return { status: 200 as const, body: updatedProduct };
  } catch (err) {
    logger.error('Upload images error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function deleteProductImage(id: string, imageUrl: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return { status: 404 as const, body: { error: 'Product not found' } };
    }

    const updatedImageUrls = product.image_urls.filter((url) => url !== imageUrl);
    await imageUploadService.deleteImage(imageUrl);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { image_urls: updatedImageUrls },
    });

    logger.info(`Image deleted from product: ${id}`);
    return { status: 200 as const, body: updatedProduct };
  } catch (err) {
    logger.error('Delete image error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}
