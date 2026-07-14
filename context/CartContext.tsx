'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartLine, CartItem, PackageCartItem, Product, Currency, ProductVariant, Package } from '@/types';
import { getProductPrice, getVariantPrice } from '@/utils/helpers';

interface CartContextType {
  cart: CartLine[];
  addToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
  addPackageToCart: (pkg: Package, quantity: number) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: (currency: Currency) => number;
  getCartItemsCount: () => number;
  getCartLineKey: (line: CartLine) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function normalizeCartLine(item: CartLine | (Omit<CartItem, 'type'> & { type?: string })): CartLine {
  if ('type' in item && item.type === 'package') {
    return item as PackageCartItem;
  }
  if ('type' in item && item.type === 'product') {
    return item as CartItem;
  }
  const { type: _ignored, ...rest } = item as CartItem & { type?: string };
  return { type: 'product', ...rest };
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartLine[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) return [];
      try {
        const parsed = JSON.parse(savedCart) as Array<CartLine | CartItem>;
        return parsed.map(normalizeCartLine);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const getCartLineKey = (line: CartLine) => {
    if (line.type === 'package') {
      return `package:${line.package.id}`;
    }
    return `product:${line.product.id}:${line.variantId || 'default'}`;
  };

  const addToCart = (product: Product, quantity: number, variant?: ProductVariant) => {
    setCart((prevCart) => {
      const lineKey = `product:${product.id}:${variant?.id || 'default'}`;
      const existingItem = prevCart.find(
        (item) => item.type === 'product' && getCartLineKey(item) === lineKey
      ) as CartItem | undefined;
      const availableStock = variant?.stock_quantity ?? product.stock_quantity;
      if (availableStock <= 0) {
        return prevCart;
      }
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, availableStock);
        return prevCart.map((item) =>
          getCartLineKey(item) === lineKey && item.type === 'product'
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      return [
        ...prevCart,
        {
          type: 'product',
          product,
          variantId: variant?.id,
          variantWeightMl: variant?.weight_ml,
          quantity: Math.min(quantity, availableStock),
        },
      ];
    });
  };

  const addPackageToCart = (pkg: Package, quantity: number) => {
    if (!pkg.in_stock || (pkg.max_quantity ?? 0) <= 0) {
      return;
    }

    setCart((prevCart) => {
      const lineKey = `package:${pkg.id}`;
      const existingItem = prevCart.find(
        (item) => item.type === 'package' && getCartLineKey(item) === lineKey
      ) as PackageCartItem | undefined;
      const maxQty = pkg.max_quantity ?? 0;

      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, maxQty);
        return prevCart.map((item) =>
          getCartLineKey(item) === lineKey && item.type === 'package'
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      return [
        ...prevCart,
        {
          type: 'package',
          package: pkg,
          quantity: Math.min(quantity, maxQty),
        },
      ];
    });
  };

  const removeFromCart = (key: string) => {
    setCart((prevCart) => prevCart.filter((item) => getCartLineKey(item) !== key));
  };

  const updateQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(key);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (getCartLineKey(item) !== key) {
          return item;
        }

        if (item.type === 'package') {
          const maxQty = item.package.max_quantity ?? 0;
          return { ...item, quantity: Math.min(quantity, maxQty) };
        }

        const availableStock =
          item.product.variants?.find((variant) => variant.id === item.variantId)?.stock_quantity ??
          item.product.stock_quantity;
        return { ...item, quantity: Math.min(quantity, availableStock) };
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = (currency: Currency) => {
    return cart.reduce((total, item) => {
      if (item.type === 'package') {
        return currency === 'NGN' ? total + item.package.price * item.quantity : total;
      }

      const variant = item.product.variants?.find((entry) => entry.id === item.variantId);
      const price = variant ? getVariantPrice(variant, currency) : getProductPrice(item.product, currency);
      return total + (price || 0) * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addPackageToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        getCartLineKey,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
