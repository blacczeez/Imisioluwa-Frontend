import { Metadata } from 'next';
import CartClient from './cart-client';

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review your cart and proceed to checkout.',
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartClient />;
}
