import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl mx-4',
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap - get all focusable elements
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    return modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }, []);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key to close
      if (e.key === 'Escape' && closeOnEscape) {
        e.preventDefault();
        onClose();
        return;
      }

      // Tab key for focus trap
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose, getFocusableElements]);

  // Save and restore focus, lock body scroll
  useEffect(() => {
    if (isOpen) {
      // Save current active element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Lock body scroll
      document.body.style.overflow = 'hidden';

      // Focus first focusable element after a short delay
      setTimeout(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 50);
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, getFocusableElements]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop with glassmorphism */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal content with glass effect */}
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} glass-card rounded-2xl shadow-glass-lg transform transition-all max-h-[90vh] overflow-hidden flex flex-col animate-slide-up`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100/50">
            {title && (
              <h2 id="modal-title" className="text-lg sm:text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 -m-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-xl transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close modal"
              >
                <X weight="bold" className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
