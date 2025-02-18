"use client";

import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

// Define the button variants using the cva function
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus-visible:ring-indigo-500",
        outline:
          "border border-gray-300 bg-transparent hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-indigo-500",
        ghost: "bg-transparent hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-indigo-500",
        secondary: "bg-gray-100 text-gray-800 shadow-sm hover:bg-gray-200 focus-visible:ring-gray-300", // Added secondary variant
        link: "bg-transparent text-indigo-600 underline-offset-4 hover:underline text-sm", // Added link variant
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Button component implementation
const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), className)} // Added className to cn
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };