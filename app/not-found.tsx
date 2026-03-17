'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="text-center py-20">
      <h1 className="font-serif text-5xl text-brand-dark mb-4">404</h1>
      <p className="text-gray-500 mb-8">{t('page_not_found', 'The page you are looking for does not exist.')}</p>
      <button
        onClick={() => router.push('/')}
        className="px-8 py-3 bg-brand hover:bg-brand-light text-white rounded-lg font-semibold text-sm uppercase tracking-label transition-colors"
      >
        {t('back_to_shop', 'Back to Shop')}
      </button>
    </div>
  );
}
