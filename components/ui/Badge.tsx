'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'brand' | 'gray';
  className?: string;
}

const colorClasses: Record<string, string> = {
  green: 'bg-emerald-50 text-success',
  red: 'bg-red-50 text-danger',
  yellow: 'bg-amber-50 text-warning',
  blue: 'bg-sky-50 text-sky-700',
  purple: 'bg-purple-50 text-purple-700',
  brand: 'bg-brand-50 text-brand',
  gray: 'bg-gray-100 text-gray-600',
};

const Badge: React.FC<BadgeProps> = ({ children, color = 'gray', className = '' }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-medium tracking-wide ${colorClasses[color]} ${className}`}>
    {children}
  </span>
);

export default Badge;
