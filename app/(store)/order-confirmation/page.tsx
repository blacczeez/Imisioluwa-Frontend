'use client';

import React, { Suspense } from 'react';
import OrderConfirmationContent from './content';

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-20"><p className="text-gray-400 text-sm">Loading...</p></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
