import { Metadata } from 'next';
import { Suspense } from 'react';
import TrackOrderContent from './content';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Enter your order number and phone number to track your Imisioluwa order status.',
};

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="text-center py-20"><p className="text-gray-400 text-sm">Loading...</p></div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
