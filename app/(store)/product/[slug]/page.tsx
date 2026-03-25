import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { encodeApiPathSegment, serverFetch } from '@/lib/api';
import { Category, Product } from '@/types';
import { SITE_URL } from '@/lib/constants';
import ProductPageClient from './product-client';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!slug?.trim()) {
    return { title: 'Product Not Found' };
  }
  const key = slug.trim();
  try {
    const product = await serverFetch<Product>(`/products/slug/${encodeApiPathSegment(key)}`);
    const productUrl = `${SITE_URL}/product/${product.slug ?? product.id}`;
    const productImage = product.image_urls?.[0];

    const categoryName = product.category?.name_en;
    const descriptor = categoryName
      ? `Authentic African ${categoryName}`
      : 'Authentic African Spiritual Product';
    const enrichedTitle = `${product.name_en} - ${descriptor}`;
    const description = product.description_en?.trim()
      ? `${product.description_en.slice(0, 140)} Shop with reliable delivery in Nigeria and worldwide shipping.`
      : `Buy ${product.name_en} from Imisioluwa. Authentic African traditional products with local and international delivery options.`;

    return {
      title: enrichedTitle,
      description,
      openGraph: {
        title: `${enrichedTitle} | Imisioluwa`,
        description,
        url: productUrl,
        siteName: 'Imisioluwa',
        images: productImage ? [{ url: productImage }] : [],
        locale: 'en_NG',
        type: 'website',
      },
      twitter: {
        card: productImage ? 'summary_large_image' : 'summary',
        title: `${enrichedTitle} | Imisioluwa`,
        description,
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
  if (!slug?.trim()) {
    notFound();
  }
  const key = slug.trim();
  let product: Product;

  try {
    product = await serverFetch<Product>(`/products/slug/${encodeApiPathSegment(key)}`);
  } catch {
    notFound();
  }

  let relatedProducts: Product[] = [];
  const categorySlug = product.category?.slug;
  if (categorySlug) {
    try {
      const cat = await serverFetch<Category & { products: Product[] }>(
        `/categories/${encodeApiPathSegment(categorySlug)}`,
        {
          revalidate: 120,
        },
      );
      relatedProducts = cat.products.filter((p) => p.id !== product.id).slice(0, 4);
    } catch {
      relatedProducts = [];
    }
  }

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}
