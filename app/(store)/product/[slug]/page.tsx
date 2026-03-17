import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api';
import { Product } from '@/types';
import ProductPageClient from './product-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await serverFetch<Product>(`/products/slug/${slug}`);
    const productUrl = `${SITE_URL}/product/${product.slug}`;
    const productImage = product.image_urls?.[0];

    return {
      title: product.name_en,
      description: product.description_en,
      openGraph: {
        title: `${product.name_en} | Imisioluwa`,
        description: product.description_en,
        url: productUrl,
        siteName: 'Imisioluwa',
        images: productImage ? [{ url: productImage }] : [],
        locale: 'en_NG',
        type: 'website',
      },
      twitter: {
        card: productImage ? 'summary_large_image' : 'summary',
        title: `${product.name_en} | Imisioluwa`,
        description: product.description_en,
        images: productImage ? [productImage] : [],
      },
      alternates: {
        canonical: productUrl,
      },
    };
  } catch {
    return { title: 'Product Not Found' };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product: Product;

  try {
    product = await serverFetch<Product>(`/products/slug/${slug}`);
  } catch {
    notFound();
  }

  return <ProductPageClient product={product} />;
}
