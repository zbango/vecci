'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';

interface LoadingButtonProps extends Omit<ButtonProps, 'children'> {
  children: React.ReactNode;
  loadingText?: string;
  isLoading?: boolean;
  loading?: boolean; // Alias for isLoading for compatibility
}

export function LoadingButton({
  children,
  loadingText = 'Guardando...',
  isLoading = false,
  loading,
  disabled,
  ...props
}: LoadingButtonProps) {
  const isSubmitting = isLoading || loading;

  return (
    <Button
      {...props}
      disabled={disabled || isSubmitting}
      className={`${props.className || ''} ${isSubmitting ? 'cursor-not-allowed' : ''}`}
    >
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isSubmitting ? loadingText : children}
    </Button>
  );
}
