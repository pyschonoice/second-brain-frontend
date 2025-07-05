// src/components/ui/Button.tsx
import React, { type ReactElement } from "react";
import { cva, type VariantProps } from "class-variance-authority"; // For cleaner variant management
import { twMerge } from 'tailwind-merge'; // For safely merging Tailwind classes


// Define button variants and sizes using CVA
const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 rounded-md text-sm",
        md: "h-10 px-4 py-2 rounded-md text-base",
        lg: "h-11 px-8 rounded-lg text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// Props for the Button component
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      startIcon,
      endIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={twMerge(
          buttonVariants({ variant, size, className }),
          isLoading && "opacity-50 cursor-not-allowed" // Dim when loading
        )}
        ref={ref}
        disabled={isLoading || disabled} // Disable button if loading or explicitly disabled
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <>
            {startIcon && <span className="mr-2">{startIcon}</span>}
            {children}
            {endIcon && <span className="ml-2">{endIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";