import React from "react";

export function FormItem({ children, className, ...props }) {
  return (
    <div className={`mb-4 ${className || ""}`} {...props}>
      {children}
    </div>
  );
}

export function FormLabel({ children, className, ...props }) {
  return (
    <label
      className={`block text-sm font-medium text-gray-700 mb-2 ${className || ""}`} // Reduced marginBottom to mb-2
      {...props}
    >
      {children}
    </label>
  );
}