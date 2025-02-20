"use client";

import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 focus-visible:ring-indigo-500",
        outline:
          "border border-gray-300 bg-transparent hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-indigo-500",
        secondary: "bg-gray-100 text-gray-800 shadow-md hover:bg-gray-200 focus-visible:ring-gray-300",
        link: "bg-transparent text-indigo-600 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <button
    className={cn(buttonVariants({ variant, size, className }))}
    ref={ref}
    {...props}
  />
));
Button.displayName = "Button";

export { Button, buttonVariants };