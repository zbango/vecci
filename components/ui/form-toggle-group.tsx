'use client';

import React from 'react';
import { FieldError } from 'react-hook-form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ToggleOption {
  value: string;
  label: string;
}

interface FormToggleGroupProps {
  value?: string;
  onValueChange: (value: string) => void;
  error?: FieldError;
  options: ToggleOption[];
  disabled?: boolean;
  className?: string;
}

export function FormToggleGroup({
  value,
  onValueChange,
  error,
  options,
  disabled = false,
  className = '',
}: FormToggleGroupProps) {
  return (
    <div>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        className={className}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className="cursor-pointer data-[state=on]:bg-green-500 data-[state=on]:text-white"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {error && (
        <div className="text-red-500 text-sm mt-1">{error.message}</div>
      )}
    </div>
  );
}
