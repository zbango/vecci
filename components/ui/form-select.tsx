'use client';

import React from 'react';
import { FieldError } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  error?: FieldError;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormSelect({
  value,
  onValueChange,
  error,
  options,
  placeholder = 'Selecciona una opción',
  disabled = false,
  className = '',
}: FormSelectProps) {
  return (
    <div>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <div className="text-red-500 text-sm mt-1">{error.message}</div>
      )}
    </div>
  );
}
