export type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR';

export interface ProductVariant {
  id: string;
  product_id: string;
  weight_ml: number;
  price: number;
  price_usd?: number;
  price_gbp?: number;
  price_eur?: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name_en: string;
  name_yo: string;
  description_en: string;
  description_yo: string;
  price: number;
  price_usd?: number;
  price_gbp?: number;
  price_eur?: number;
  weight_kg?: number;
  variants?: ProductVariant[];
  category_id: string;
  category?: Category;
  image_urls: string[];
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_yo: string;
  slug: string;
  image_url?: string;
  parent_id?: string;
  created_at: string;
}

export interface ProductFormData {
  name_en: string;
  name_yo: string;
  description_en: string;
  description_yo: string;
  price: number;
  price_usd?: number;
  price_gbp?: number;
  price_eur?: number;
  weight_kg?: number;
  variants?: Array<{
    id?: string;
    weight_ml: number;
    price: number;
    price_usd?: number;
    price_gbp?: number;
    price_eur?: number;
    stock_quantity: number;
    is_active: boolean;
  }>;
  category_id: string;
  stock_quantity: number;
  is_active: boolean;
}

export interface CartItem {
  type: 'product';
  product: Product;
  variantId?: string;
  variantWeightMl?: number;
  quantity: number;
}

export interface PackageItemEntry {
  id: string;
  variant_id: string;
  quantity: number;
  variant: {
    id: string;
    weight_ml: number;
    stock_quantity: number;
    product: {
      id: string;
      slug: string;
      name_en: string;
      name_yo: string;
      image_urls: string[];
    };
  };
}

export interface Package {
  id: string;
  slug: string;
  name_en: string;
  name_yo: string;
  problem_statement_en: string;
  description_en: string;
  description_yo: string;
  price: number;
  image_url?: string | null;
  is_active: boolean;
  is_promoted: boolean;
  in_stock?: boolean;
  max_quantity?: number;
  stock_blockers?: string[];
  items: PackageItemEntry[];
  created_at: string;
  updated_at: string;
}

export interface PackageCartItem {
  type: 'package';
  package: Package;
  quantity: number;
}

export type CartLine = CartItem | PackageCartItem;

export interface PackageFormData {
  name_en: string;
  name_yo: string;
  problem_statement_en: string;
  description_en: string;
  description_yo: string;
  price: number;
  slug?: string;
  image_url?: string;
  is_active: boolean;
  is_promoted: boolean;
  items: Array<{ variant_id: string; quantity: number }>;
}

export interface OrderPackageItem {
  id: string;
  package_id?: string | null;
  package_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  delivery_address: string;
  total_amount: number;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  payment_status: 'PENDING' | 'PAID' | 'FAILED';
  payment_method: string;
  payment_reference?: string;
  currency?: string;
  country?: string;
  shipping_state?: string;
  shipping_lga?: string;
  shipping_cost?: number;
  payment_gateway?: string;
  notes?: string;
  items: OrderItem[];
  package_items?: OrderPackageItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface PaymentInitResponse {
  gateway: 'paystack' | 'stripe';
  // Paystack fields
  authorization_url?: string;
  access_code?: string;
  reference?: string;
  // Stripe fields
  sessionId?: string;
  url?: string;
}

export type Language = 'en' | 'yo' | 'fr';
