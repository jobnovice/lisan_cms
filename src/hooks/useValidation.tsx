/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useValidation.ts
import { useState } from 'react';

export const useValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateRequired = (value: any, fieldName: string): string => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return '';
  };

  const validateNumber = (value: any, fieldName: string): string => {
    if (!value || isNaN(Number(value)) || Number(value) < 1) {
      return `${fieldName} must be a positive number`;
    }
    return '';
  };

  const setError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateRequired,
    validateNumber,
    setError,
    clearError,
    clearAllErrors,
  };
};