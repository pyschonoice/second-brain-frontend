// src/components/ui/Select.tsx
import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

// Context for Select components
interface SelectContextType<T extends string = string> {
  value: T;
  onValueChange: (value: T) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SelectContext = createContext<SelectContextType<any> | undefined>(undefined);

export const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (context === undefined) {
    throw new Error('Select components must be used within a <Select> component');
  }
  return context;
};

interface SelectProps<T extends string = string> {
  value: T;
  onValueChange: (value: T) => void;
  children: React.ReactNode;
  className?: string;
}

export const Select = <T extends string,>({ value, onValueChange, children, className }: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const contextValue: SelectContextType<T> = {
    value,
    onValueChange,
    isOpen,
    setIsOpen,
    triggerRef,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div className={twMerge("relative", className)}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className }) => {
  const { isOpen, setIsOpen, triggerRef } = useSelectContext(); // No value here as it will be rendered by SelectValue

  const handleClick = () => {
    setIsOpen((prev: boolean) => !prev);
  };

  return (
    <button
      ref={triggerRef}
      onClick={handleClick}
      className={twMerge(
        "flex items-center justify-between px-4 py-2 rounded-md border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      {children} {/* SelectValue component will be a child here */}
      <svg
        className={twMerge("ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200", isOpen ? "rotate-180" : "rotate-0")}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
};

interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

export const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
  const { isOpen } = useSelectContext();

  if (!isOpen) return null;

  return (
    <div
      className={twMerge(
        "absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
        className
      )}
      role="listbox"
    >
      {children}
    </div>
  );
};

interface SelectItemProps<T extends string> {
  value: T;
  children: ReactNode;
  className?: string;
}

export const SelectItem = <T extends string,>({ value, children, className }: SelectItemProps<T>) => {
  const { value: selectedValue, onValueChange, setIsOpen } = useSelectContext();
  const isSelected = selectedValue === value;

  const handleClick = () => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className={twMerge(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected ? "bg-accent text-accent-foreground" : "",
        className
      )}
      role="option"
      aria-selected={isSelected}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
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
            className="h-4 w-4"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
      {children}
    </div>
  );
};

interface SelectValueProps {
  children?: ReactNode; // Optional children for placeholder
  placeholder?: string; // Placeholder when no value is selected or children are not provided
  className?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ children, placeholder, className }) => {
  const { value } = useSelectContext();
  return (
    <span className={className}>
      {children || value || placeholder}
    </span>
  );
};