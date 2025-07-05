// src/components/ui/Input.tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9); // Generate ID if not provided

    return (
      <div className="relative w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium dark:text-white mb-1 flex justify-start pl-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={twMerge(
            'flex h-8 w-full rounded-sm border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground text-sm font-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive', // Highlight input on error
            className
          )}
          id={inputId}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';