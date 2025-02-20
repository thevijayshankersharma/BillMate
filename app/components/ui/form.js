import React from "react";

export function FormItem({ children, className, ...props }) {
  return (
    <div className={`space-y-2 ${className || ""}`} {...props}>
      {children}
    </div>
  );
}

export function FormLabel({ children, className, ...props }) {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className || ""}`} {...props}>
      {children}
    </label>
  );
}