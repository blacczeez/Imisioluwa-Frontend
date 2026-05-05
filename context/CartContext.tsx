'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Currency, ProductVariant } from '@/types';
import { getProductPrice, getVariantPrice } from '@/utils/helpers';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getCartTotal: (currency: Currency) => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number, variant?: ProductVariant) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id && item.variantId === variant?.id);
      const availableStock = variant?.stock_quantity ?? product.stock_quantity;
      if (availableStock <= 0) {
        return prevCart;
      }
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, availableStock);
        return prevCart.map((item) =>
          item.product.id === product.id && item.variantId === variant?.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      return [...prevCart, {
        product,
        variantId: variant?.id,
        variantWeightMl: variant?.weight_ml,
        quantity: Math.min(quantity, availableStock),
      }];
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.product.id === productId && item.variantId === variantId)));
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.variantId === variantId
          ? {
            ...item,
            quantity: Math.min(
              quantity,
              item.product.variants?.find((variant) => variant.id === item.variantId)?.stock_quantity ?? item.product.stock_quantity
            ),
          }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = (currency: Currency) => {
    return cart.reduce((total, item) => {
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
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
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
