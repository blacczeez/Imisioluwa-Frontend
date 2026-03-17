'use client';

import React from 'react';
import { ToastProvider } from '@/context/ToastContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { CartProvider } from '@/context/CartContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import '@/i18n';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <CartProvider>
            <AdminAuthProvider>
              {children}
            </AdminAuthProvider>
          </CartProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ToastProvider>
  );
}
