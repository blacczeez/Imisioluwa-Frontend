import { Currency, Product, ProductVariant } from '@/types';

const CURRENCY_CONFIG: Record<Currency, { locale: string; code: string }> = {
  NGN: { locale: 'en-NG', code: 'NGN' },
  USD: { locale: 'en-US', code: 'USD' },
  GBP: { locale: 'en-GB', code: 'GBP' },
  EUR: { locale: 'fr-FR', code: 'EUR' },
};

export const formatCurrency = (amount: number, currency: Currency = 'NGN'): string => {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.NGN;
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const getProductPrice = (
  product: { price: number; price_usd?: number; price_gbp?: number; price_eur?: number },
  currency: Currency
): number | null => {
  switch (currency) {
    case 'USD': return product.price_usd ?? null;
    case 'GBP': return product.price_gbp ?? null;
    case 'EUR': return product.price_eur ?? null;
    default: return product.price;
  }
};

export const getVariantPrice = (
  variant: { price: number; price_usd?: number; price_gbp?: number; price_eur?: number },
  currency: Currency
): number | null => getProductPrice(variant, currency);

export const getActiveVariants = (product: Product): ProductVariant[] => {
  const variants = product.variants || [];
  return variants.filter((variant) => variant.is_active);
};

export const getCheapestVariant = (product: Product, currency: Currency): ProductVariant | null => {
  const variants = getActiveVariants(product);
  if (variants.length === 0) return null;

  const withPrices = variants
    .map((variant) => ({ variant, price: getVariantPrice(variant, currency) }))
    .filter((entry) => entry.price !== null) as Array<{ variant: ProductVariant; price: number }>;

  if (withPrices.length === 0) return variants[0];

  withPrices.sort((a, b) => a.price - b.price);
  return withPrices[0].variant;
};

export const getProductName = (product: { name_en: string; name_yo: string }, language: string): string => {
  if (language === 'yo') return product.name_yo;
  return product.name_en;
};

export const getProductDescription = (
  product: { description_en: string; description_yo: string },
  language: string
): string => {
  if (language === 'yo') return product.description_yo;
  return product.description_en;
};

export const getCategoryName = (category: { name_en: string; name_yo: string }, language: string): string => {
  if (language === 'yo') return category.name_yo;
  return category.name_en;
};

export const getPackageName = (pkg: { name_en: string; name_yo: string }, language: string): string => {
  if (language === 'yo') return pkg.name_yo;
  return pkg.name_en;
};

export const getPackageDescription = (
  pkg: { description_en: string; description_yo: string },
  language: string
): string => {
  if (language === 'yo') return pkg.description_yo;
  return pkg.description_en;
};

export const getPackageProblem = (
  pkg: { problem_statement_en: string },
  language: string
): string => {
  return pkg.problem_statement_en;
};
