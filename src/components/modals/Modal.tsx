// src/components/ui/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string; // For additional styling on the modal content itself
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Close modal if clicking outside the content area
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in" aria-hidden="true" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={twMerge(
          "relative z-10 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg animate-scale-in",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        <div className="flex justify-between items-center mb-4">
          {title && (
            <h2 id="modal-title" className="text-xl font-semibold text-card-foreground pl-4">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6L18 18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body // Portal into the body directly
  );
};