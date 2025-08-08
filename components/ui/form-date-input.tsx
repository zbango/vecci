'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { Input, InputAddon, InputGroup } from '@/components/ui/input';

interface FormDateInputProps {
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormDateInput({
  register,
  error,
  placeholder = 'DD/MM/YYYY',
  disabled = false,
  className = '',
}: FormDateInputProps) {
  return (
    <div>
      <InputGroup>
        <InputAddon mode="icon">
          <Calendar />
        </InputAddon>
        <Input
          {...register}
          placeholder={placeholder}
          disabled={disabled}
          className={`transition-none ${error ? 'border-red-500' : ''} ${className}`}
        />
      </InputGroup>
      {error && (
        <div className="text-red-500 text-sm mt-1">{error.message}</div>
      )}
    </div>
  );
}
