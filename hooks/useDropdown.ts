'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseDropdownOptions {
  onSelect?: (value: string) => void;
  itemCount: number;
  labels?: string[];
}

export function useDropdown({ onSelect, itemCount, labels = [] }: UseDropdownOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const typeaheadRef = useRef('');
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const open = useCallback(() => {
    setIsOpen(true);
    setActiveIndex(-1);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  // Outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      close();
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, close]);

  // Keyboard handling
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            open();
          } else {
            setActiveIndex((prev) => (prev + 1) % itemCount);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen) {
            open();
          } else {
            setActiveIndex((prev) => (prev - 1 + itemCount) % itemCount);
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!isOpen) {
            open();
          } else if (activeIndex >= 0) {
            onSelect?.(String(activeIndex));
            close();
            triggerRef.current?.focus();
          }
          break;
        case 'Escape':
          e.preventDefault();
          close();
          triggerRef.current?.focus();
          break;
        case 'Tab':
          close();
          break;
        default:
          // Typeahead
          if (e.key.length === 1 && labels.length > 0) {
            e.preventDefault();
            clearTimeout(typeaheadTimerRef.current);
            typeaheadRef.current += e.key.toLowerCase();

            const match = labels.findIndex((label) =>
              label.toLowerCase().startsWith(typeaheadRef.current)
            );
            if (match !== -1) {
              if (!isOpen) open();
              setActiveIndex(match);
            }

            typeaheadTimerRef.current = setTimeout(() => {
              typeaheadRef.current = '';
            }, 500);
          }
          break;
      }
    },
    [isOpen, activeIndex, itemCount, onSelect, open, close, labels]
  );

  // Cleanup typeahead timer
  useEffect(() => {
    return () => clearTimeout(typeaheadTimerRef.current);
  }, []);

  return {
    isOpen,
    activeIndex,
    setActiveIndex,
    triggerRef,
    menuRef,
    open,
    close,
    toggle,
    handleKeyDown,
  };
}
