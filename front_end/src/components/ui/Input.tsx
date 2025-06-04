import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  ...props
}) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-white mb-1">
        {label}
      </label>
    )}
    <input
      className={clsx(
        "w-full px-4 py-2 rounded-xl bg-gray-800 border border-border text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition",
        error && "border-apple-red focus:ring-apple-red",
        className
      )}
      {...props}
    />
    {helperText && !error && (
      <p className="text-xs text-muted mt-1">{helperText}</p>
    )}
    {error && <p className="text-xs text-apple-red mt-1">{error}</p>}
  </div>
);

export default Input;
