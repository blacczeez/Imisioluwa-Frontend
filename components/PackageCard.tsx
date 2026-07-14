'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency, getPackageName } from '@/utils/helpers';

interface PackageCardProps {
  pkg: Package;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const { language } = useLanguage();
  const name = getPackageName(pkg, language);

  return (
    <Link
      href={`/package/${pkg.slug}`}
      className="group block bg-white rounded-xl border border-border overflow-hidden hover:border-brand-300 transition-colors"
    >
      <div className="relative aspect-[4/3] bg-brand-50">
        {pkg.image_url ? (
          <Image src={pkg.image_url} alt={name} fill className="object-cover group-hover:scale-[1.02] transition-transform" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">No Image</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-label text-brand mb-1">Package</p>
        <h3 className="font-semibold text-brand-dark text-sm uppercase tracking-label mb-2 line-clamp-2">{name}</h3>
        <p className="text-brand font-bold">{formatCurrency(pkg.price, 'NGN')}</p>
        <p className="text-xs text-gray-400 mt-2">{pkg.items.length} items included</p>
      </div>
    </Link>
  );
};

export default PackageCard;
