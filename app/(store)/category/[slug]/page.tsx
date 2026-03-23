import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api';
import { Category, Product } from '@/types';
import { SITE_URL } from '@/lib/constants';
import CategoryPageClient from './category-client';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await serverFetch<Category & { products: Product[] }>(`/categories/${slug}`);
    const categoryUrl = `${SITE_URL}/category/${category.slug}`;

    // Use first product image as category OG image if available
    const categoryImage = category.products?.[0]?.image_urls?.[0];

    return {
      title: category.name_en,
      description: `Shop ${category.name_en} — authentic African traditional products from Imisioluwa. Free delivery in Nigeria, worldwide shipping available.`,
      openGraph: {
        title: `${category.name_en} | Imisioluwa`,
        description: `Shop ${category.name_en} — authentic African traditional products from Imisioluwa.`,
        url: categoryUrl,
        siteName: 'Imisioluwa',
        locale: 'en_NG',
        type: 'website',
        images: categoryImage ? [{ url: categoryImage }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.name_en} | Imisioluwa`,
        description: `Shop ${category.name_en} — authentic African traditional products from Imisioluwa.`,
        images: categoryImage ? [categoryImage] : undefined,
      },
      alternates: {
        canonical: categoryUrl,
      },
    };
  } catch {
    return { title: 'Category Not Found' };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  let category: Category & { products: Product[] };

  try {
    category = await serverFetch<Category & { products: Product[] }>(`/categories/${slug}`);
  } catch {
    notFound();
  }

  return <CategoryPageClient category={category} />;
}
