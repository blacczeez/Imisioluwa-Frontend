'use client';

import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantClasses = {
  primary: 'bg-brand hover:bg-brand-light text-white',
  secondary: 'bg-brand-50 hover:bg-brand-100 text-brand-dark border border-border',
  danger: 'bg-danger hover:bg-red-700 text-white',
  ghost: 'bg-transparent hover:bg-brand-50 text-brand-dark',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
export default Button;
