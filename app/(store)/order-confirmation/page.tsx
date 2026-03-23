import { Metadata } from 'next';
import { Suspense } from 'react';
import OrderConfirmationContent from './content';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been placed successfully. Thank you for shopping with Imisioluwa.',
  robots: { index: false, follow: true },
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-20"><p className="text-gray-400 text-sm">Loading...</p></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
