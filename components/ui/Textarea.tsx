'use client';

import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, required, ...props }, ref) => {
    const textareaId = id || props.name;
    return (
      <div>
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-brand-dark mb-2">
            {label}{required && ' *'}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
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

Textarea.displayName = 'Textarea';
export default Textarea;
