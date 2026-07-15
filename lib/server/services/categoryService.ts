import { prisma } from '@/lib/server/prisma';
import { logger } from '@/lib/server/utils/logger';

export async function listCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name_en: 'asc' },
    });

    return { status: 200 as const, body: categories };
  } catch (err) {
    logger.error('Get categories error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { is_active: true, stock_quantity: { gt: 0 } },
          include: {
            variants: { orderBy: { weight_ml: 'asc' } },
          },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!category) {
      return { status: 404 as const, body: { error: 'Category not found' } };
    }

    return { status: 200 as const, body: category };
  } catch (err) {
    logger.error('Get category by slug error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function createCategory(body: {
  name_en: string;
  name_yo: string;
  slug: string;
  image_url?: string | null;
  parent_id?: string | null;
}) {
  try {
    const { name_en, name_yo, slug, image_url, parent_id } = body;

    const category = await prisma.category.create({
      data: {
        name_en,
        name_yo,
        slug,
        image_url,
        parent_id,
      },
    });

    logger.info(`Category created: ${category.id}`);
    return { status: 201 as const, body: category };
  } catch (err) {
    logger.error('Create category error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function updateCategory(
  id: string,
  body: {
    name_en?: string;
    name_yo?: string;
    slug?: string;
    image_url?: string | null;
    parent_id?: string | null;
  }
) {
  try {
    const { name_en, name_yo, slug, image_url, parent_id } = body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name_en && { name_en }),
        ...(name_yo && { name_yo }),
        ...(slug && { slug }),
        ...(image_url !== undefined && { image_url }),
        ...(parent_id !== undefined && { parent_id }),
      },
    });

    logger.info(`Category updated: ${category.id}`);
    return { status: 200 as const, body: category };
  } catch (err) {
    logger.error('Update category error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });

    logger.info(`Category deleted: ${id}`);
    return { status: 200 as const, body: { message: 'Category deleted successfully' } };
  } catch (err) {
    logger.error('Delete category error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}
