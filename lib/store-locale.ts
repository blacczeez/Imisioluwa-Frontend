import type { Language } from '@/types';

/** HttpOnly=false cookie so the client can set it when language changes; RSC reads it for blog copy. */
export const LOCALE_COOKIE = 'imisi_language';

export type StoreLocale = Language;

export function parseStoreLocale(value: string | undefined): StoreLocale {
  if (value === 'yo' || value === 'fr') return value;
  return 'en';
}
