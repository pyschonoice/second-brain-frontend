// src/components/ui/Label.tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label: React.FC<LabelProps> = ({ className, children, ...props }) => {
  return (
    <label
      className={twMerge(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};