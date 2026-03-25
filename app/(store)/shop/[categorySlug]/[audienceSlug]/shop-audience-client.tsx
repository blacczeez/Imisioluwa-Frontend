'use client';

import React from 'react';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

interface Props {
  products: Product[];
}

export default function ShopAudienceClient({ products }: Props) {
  if (products.length === 0) {
    return <p className="text-gray-500 text-center py-16">No in-stock products in this category right now.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
