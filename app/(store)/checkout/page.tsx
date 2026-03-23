import { Metadata } from 'next';
import CheckoutClient from './checkout-client';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order — enter your delivery details and choose a payment method.',
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
