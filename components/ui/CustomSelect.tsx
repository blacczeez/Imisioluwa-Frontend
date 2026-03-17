'use client';

import React, { useRef, useCallback, useEffect, useId, useState } from 'react';
import { useDropdown } from '@/hooks/useDropdown';

export interface CustomSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  options: CustomSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  id?: string;
  variant?: 'form' | 'inline';
  size?: 'sm' | 'md';
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  menuStrategy?: 'absolute' | 'fixed';
  'aria-label'?: string;
}

const CustomSelect = React.forwardRef<HTMLSelectElement, CustomSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder,
      name,
      id,
      variant = 'form',
      size = 'md',
      label,
      error,
      required,
      disabled,
      className = '',
      menuStrategy = 'absolute',
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const uid = useId();
    const listboxId = `${uid}-listbox`;
    const hiddenSelectRef = useRef<HTMLSelectElement | null>(null);
    const [fixedPos, setFixedPos] = useState({ top: 0, left: 0, width: 0 });

    const selectedOption = options.find((o) => o.value === value);

    const handleSelect = useCallback(
      (indexStr: string) => {
        const idx = Number(indexStr);
        const option = options[idx];
        if (!option) return;

        onChange?.(option.value);

        // Dispatch native change event for react-hook-form
        const hiddenEl = hiddenSelectRef.current;
        if (hiddenEl) {
          const nativeSetter = Object.getOwnPropertyDescriptor(
            HTMLSelectElement.prototype,
            'value'
          )?.set;
          nativeSetter?.call(hiddenEl, option.value);
          hiddenEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
      },
      [options, onChange]
    );

    const {
      isOpen,
      activeIndex,
      setActiveIndex,
      triggerRef,
      menuRef,
      toggle,
      close,
      handleKeyDown,
    } = useDropdown({
      onSelect: handleSelect,
      itemCount: options.length,
      labels: options.map((o) => o.label),
    });

    // Compute fixed position when opening with fixed strategy
    useEffect(() => {
      if (!isOpen || menuStrategy !== 'fixed') return;

      const updatePos = () => {
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect) {
          setFixedPos({
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
          });
        }
      };

      updatePos();

      // Close on scroll for fixed menus
      const handleScroll = () => close();
      window.addEventListener('scroll', handleScroll, true);
      return () => window.removeEventListener('scroll', handleScroll, true);
    }, [isOpen, menuStrategy, close, triggerRef]);

    // Scroll active option into view
    useEffect(() => {
      if (!isOpen || activeIndex < 0) return;
      const menu = menuRef.current;
      if (!menu) return;
      const item = menu.children[activeIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex, isOpen, menuRef]);

    // Merge refs for hidden select
    const setHiddenSelectRef = useCallback(
      (el: HTMLSelectElement | null) => {
        hiddenSelectRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLSelectElement | null>).current = el;
      },
      [ref]
    );

    const isForm = variant === 'form';
    const isSm = size === 'sm';

    const triggerClasses = isForm
      ? `w-full px-4 ${isSm ? 'py-1.5 text-xs' : 'py-3 text-sm'} border rounded-lg bg-white text-brand-dark hover:border-brand-300 focus:ring-2 focus:ring-brand-light focus:border-transparent transition-colors ${
          error ? 'border-danger' : 'border-border'
        }`
      : `bg-transparent border-none text-sm font-medium text-brand-dark uppercase tracking-label focus:outline-none`;

    const menuBaseClasses =
      'bg-white border border-border rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto animate-dropdown z-50';

    const selectId = id || name || uid;

    const chevron = (
      <svg
        className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    );

    const checkmark = (
      <svg className="w-4 h-4 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );

    const renderMenu = () => {
      if (!isOpen) return null;

      const menuContent = options.map((option, index) => {
        const isSelected = option.value === value;
        const isActive = index === activeIndex;

        return (
          <div
            key={option.value}
            id={`${uid}-option-${index}`}
            role="option"
            aria-selected={isSelected}
            className={`flex items-center justify-between gap-2 cursor-pointer transition-colors ${
              isSm ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
            } ${isActive ? 'bg-brand-50' : ''} ${isSelected ? 'font-medium text-brand' : 'text-brand-dark'}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseDown={(e) => {
              e.preventDefault();
              handleSelect(String(index));
              close();
              triggerRef.current?.focus();
            }}
          >
            <span className="flex items-center gap-2">
              {option.icon}
              {option.label}
            </span>
            {isSelected && checkmark}
          </div>
        );
      });

      if (menuStrategy === 'fixed') {
        return (
          <div
            ref={menuRef}
            role="listbox"
            id={listboxId}
            aria-activedescendant={activeIndex >= 0 ? `${uid}-option-${activeIndex}` : undefined}
            className={menuBaseClasses}
            style={{
              position: 'fixed',
              top: fixedPos.top,
              left: fixedPos.left,
              width: fixedPos.width,
              minWidth: '160px',
            }}
          >
            {menuContent}
          </div>
        );
      }

      return (
        <div
          ref={menuRef}
          role="listbox"
          id={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${uid}-option-${activeIndex}` : undefined}
          className={`absolute left-0 right-0 mt-1 ${menuBaseClasses}`}
        >
          {menuContent}
        </div>
      );
    };

    return (
      <div className={className}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-brand-dark mb-2">
            {label}
            {required && ' *'}
          </label>
        )}

        <div className={menuStrategy === 'absolute' ? 'relative' : ''}>
          {/* Hidden native select for react-hook-form */}
          <select
            ref={setHiddenSelectRef}
            name={name}
            id={selectId}
            value={value}
            required={required}
            disabled={disabled}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => onChange?.(e.target.value)}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom trigger */}
          <button
            ref={triggerRef}
            type="button"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={isOpen ? listboxId : undefined}
            aria-label={ariaLabel}
            disabled={disabled}
            onClick={toggle}
            onKeyDown={handleKeyDown}
            className={`flex items-center justify-between gap-2 text-left cursor-pointer ${triggerClasses} ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className={`truncate ${!selectedOption && isForm ? 'text-gray-400' : ''}`}>
              {selectedOption ? (
                <span className="flex items-center gap-2">
                  {selectedOption.icon}
                  {selectedOption.label}
                </span>
              ) : (
                placeholder || '\u00A0'
              )}
            </span>
            {chevron}
          </button>

          {renderMenu()}
        </div>

        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

CustomSelect.displayName = 'CustomSelect';
export default CustomSelect;
