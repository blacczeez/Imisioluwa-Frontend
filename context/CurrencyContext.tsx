'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency } from '@/types';

interface CurrencyContextType {
  currency: Currency;
  country: string;
  setCurrency: (currency: Currency) => void;
  setCountry: (country: string) => void;
  currencySymbol: string;
  detectionDone: boolean;
}

const COUNTRY_TO_CURRENCY: Record<string, Currency> = {
  NG: 'NGN',
  US: 'USD',
  CA: 'USD',
  GB: 'GBP',
  FR: 'EUR',
  DE: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  PT: 'EUR',
  IE: 'EUR',
  SE: 'EUR',
  DK: 'EUR',
  FI: 'EUR',
  NO: 'EUR',
  CH: 'EUR',
  PL: 'EUR',
  CZ: 'EUR',
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  NGN: '\u20A6',
  USD: '$',
  GBP: '\u00A3',
  EUR: '\u20AC',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currency');
      return (saved as Currency) || 'NGN';
    }
    return 'NGN';
  });
  const [country, setCountryState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('country') || 'NG';
    }
    return 'NG';
  });
  const [detectionDone, setDetectionDone] = useState(false);

  useEffect(() => {
    // Only auto-detect if user hasn't manually set a preference
    const hasManualChoice = localStorage.getItem('currencyManual');
    if (hasManualChoice) {
      setDetectionDone(true);
      return;
    }

    const apiUrl = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL || '' : '';
    const geoUrl = apiUrl ? `${apiUrl.replace(/\/$/, '')}/geo` : 'https://ip-api.com/json/?fields=countryCode';

    fetch(geoUrl)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`${res.status}`))))
      .then((data: { countryCode?: string | null }) => {
        if (data?.countryCode) {
          const detectedCountry = data.countryCode.toUpperCase();
          const detectedCurrency = COUNTRY_TO_CURRENCY[detectedCountry] || 'USD';
          setCountryState(detectedCountry);
          setCurrencyState(detectedCurrency);
          localStorage.setItem('country', detectedCountry);
          localStorage.setItem('currency', detectedCurrency);
        }
      })
      .catch(() => {
        // Detection failed (e.g. 403 from ip-api in browser, or backend down) — keep defaults (NGN/NG)
      })
      .finally(() => {
        setDetectionDone(true);
      });
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('currency', c);
    localStorage.setItem('currencyManual', 'true');
  };

  const setCountry = (c: string) => {
    setCountryState(c);
    localStorage.setItem('country', c);
    const mapped = COUNTRY_TO_CURRENCY[c.toUpperCase()] || 'USD';
    setCurrencyState(mapped);
    localStorage.setItem('currency', mapped);
    localStorage.setItem('currencyManual', 'true');
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        country,
        setCurrency,
        setCountry,
        currencySymbol: CURRENCY_SYMBOLS[currency],
        detectionDone,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
