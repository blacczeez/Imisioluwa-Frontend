'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, required, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-brand-dark mb-2">
            {label}{required && ' *'}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-light focus:border-transparent transition-colors ${
            error ? 'border-danger' : 'border-border'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
