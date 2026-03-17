'use client';

import React, { Suspense } from 'react';
import TrackOrderContent from './content';

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="text-center py-20"><p className="text-gray-400 text-sm">Loading...</p></div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
