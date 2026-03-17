'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, className = '' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border ${className}`}>
        {title && (
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h2 className="font-serif text-xl text-brand-dark">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-brand-dark text-2xl leading-none transition-colors">
              &times;
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-border bg-brand-50 rounded-b-xl">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
