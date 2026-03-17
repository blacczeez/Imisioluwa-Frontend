'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl border border-border ${className}`}>
    {children}
  </div>
);

export default Card;
