'use client';

import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface FormTextInputProps {
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
}

export function FormTextInput({
  register,
  error,
  placeholder,
  type = 'text',
  autoComplete = 'off',
  disabled = false,
  className = '',
}: FormTextInputProps) {
  return (
    <div>
      <Input
        {...register}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`transition-none ${error ? 'border-red-500' : ''} ${className}`}
      />
      {error && (
        <div className="text-red-500 text-sm mt-1">{error.message}</div>
      )}
    </div>
  );
}
