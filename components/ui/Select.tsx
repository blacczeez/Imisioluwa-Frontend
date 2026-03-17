'use client';

import React from 'react';
import CustomSelect from './CustomSelect';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', id, required, name, value, onChange, disabled }, ref) => {
    return (
      <CustomSelect
        ref={ref}
        options={options}
        value={value as string}
        onChange={(val) => {
          const syntheticEvent = {
            target: { value: val, name: name || '' },
          } as React.ChangeEvent<HTMLSelectElement>;
          onChange?.(syntheticEvent);
        }}
        placeholder={placeholder}
        name={name}
        id={id}
        label={label}
        error={error}
        required={required}
        disabled={disabled}
        variant="form"
        className={className}
      />
    );
  }
);

Select.displayName = 'Select';
export default Select;
