/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ValidatedField.tsx
import React from 'react';

interface ValidatedFieldProps {
  label: string;
  type?: string;
  value: any;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const ValidatedField: React.FC<ValidatedFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  className = '',
}) => {
  return (
    <div className={className}>
      <label className="flex flex-col">
        <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </p>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full rounded-md border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            error 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 bg-white'
          }`}
          placeholder={placeholder}
        />
      </label>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};