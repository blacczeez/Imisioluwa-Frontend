'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/types';
import { CustomSelect } from './ui';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'yo', label: 'Yor\u00F9b\u00E1' },
  { value: 'fr', label: 'Fran\u00E7ais' },
];

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <CustomSelect
      options={languages}
      value={language}
      onChange={(val) => setLanguage(val as Language)}
      variant="inline"
      aria-label="Select language"
    />
  );
};

export default LanguageSwitcher;
