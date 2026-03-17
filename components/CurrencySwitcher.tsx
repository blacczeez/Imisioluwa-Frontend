'use client';

import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { Currency } from '@/types';
import { CustomSelect } from './ui';

const currencies = [
  { value: 'NGN', label: '\u20A6 NGN' },
  { value: 'USD', label: '$ USD' },
  { value: 'GBP', label: '\u00A3 GBP' },
  { value: 'EUR', label: '\u20AC EUR' },
];

const currenciesCompact = [
  { value: 'NGN', label: '\u20A6' },
  { value: 'USD', label: '$' },
  { value: 'GBP', label: '\u00A3' },
  { value: 'EUR', label: '\u20AC' },
];

const CurrencySwitcher: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { currency, setCurrency } = useCurrency();

  return (
    <CustomSelect
      options={compact ? currenciesCompact : currencies}
      value={currency}
      onChange={(val) => setCurrency(val as Currency)}
      variant="inline"
      aria-label="Select currency"
    />
  );
};

export default CurrencySwitcher;
