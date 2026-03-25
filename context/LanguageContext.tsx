'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Language } from '@/types';
import { LOCALE_COOKIE } from '@/lib/store-locale';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return (saved as Language) || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
    const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
    const prevCookie = match?.[1];
    document.cookie = `${LOCALE_COOKIE}=${language};path=/;max-age=31536000;SameSite=Lax`;
    const cookieMismatch = prevCookie !== language;
    const skipRefreshForDefaultEn = prevCookie === undefined && language === 'en';
    if (cookieMismatch && !skipRefreshForDefaultEn) {
      router.refresh();
    }
  }, [language, i18n, router]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'yo' : 'en'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
