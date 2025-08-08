'use client';

import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface FormPhoneInputProps {
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  countryCode?: string;
  countryFlag?: string;
}

export function FormPhoneInput({
  register,
  error,
  placeholder,
  disabled = false,
  className = '',
  countryCode = 'EC (+593)',
  countryFlag = '/media/flags/ecuador.svg',
}: FormPhoneInputProps) {
  return (
    <div>
      <div className="flex">
        <div className="flex items-center gap-2 px-3 py-2 border border-r-0 rounded-l-md">
          <img
            src={countryFlag}
            alt="Country"
            className="w-4 h-4 object-cover rounded-full"
          />
          <span className="text-xs">{countryCode}</span>
        </div>
        <Input
          {...register}
          type="text"
          placeholder={placeholder}
          className={`flex-1 h-10 bg-white rounded-l-none shadow-sm transition-none ${
            error ? 'border-red-500' : ''
          } ${className}`}
          autoComplete="off"
          disabled={disabled}
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-1">{error.message}</div>
      )}
    </div>
  );
}
