'use client';

import * as React from 'react';

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from './alert';
import {
  RiCheckLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiShieldCrossLine,
} from '@remixicon/react';
import { createContext, useCallback, useContext, useState } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <RiCheckLine />;
      case 'error':
        return <RiShieldCrossLine />;
      case 'warning':
        return <RiErrorWarningLine />;
      case 'info':
        return <RiInformationLine />;
      default:
        return <RiInformationLine />;
    }
  };

  const getVariant = () => {
    switch (toast.type) {
      case 'success':
        return 'success';
      case 'error':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-[400px]">
      <Alert
        appearance="light"
        variant={getVariant()}
        close={true}
        onClose={() => onRemove(toast.id)}
        className="w-full shadow-lg"
      >
        <AlertIcon>{getIcon()}</AlertIcon>
        <AlertContent>
          <AlertTitle>{toast.title}</AlertTitle>
          {toast.description && (
            <AlertDescription>{toast.description}</AlertDescription>
          )}
        </AlertContent>
      </Alert>
    </div>
  );
}

function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Toast methods
export const toast = {
  success: (
    message:
      | string
      | { title: string; description?: string; duration?: number },
  ) => {
    const toastData =
      typeof message === 'string' ? { title: message } : message;

    // This will be called from components that have access to the context
    return { type: 'success' as const, ...toastData };
  },

  error: (
    message:
      | string
      | { title: string; description?: string; duration?: number },
  ) => {
    const toastData =
      typeof message === 'string' ? { title: message } : message;

    return { type: 'error' as const, ...toastData };
  },

  warning: (
    message:
      | string
      | { title: string; description?: string; duration?: number },
  ) => {
    const toastData =
      typeof message === 'string' ? { title: message } : message;

    return { type: 'warning' as const, ...toastData };
  },

  info: (
    message:
      | string
      | { title: string; description?: string; duration?: number },
  ) => {
    const toastData =
      typeof message === 'string' ? { title: message } : message;

    return { type: 'info' as const, ...toastData };
  },
};

// Hook for components to use toast
export function useToastActions() {
  const { addToast } = useToast();

  return {
    success: (
      message:
        | string
        | { title: string; description?: string; duration?: number },
    ) => {
      const toastData =
        typeof message === 'string' ? { title: message } : message;
      addToast({ type: 'success', ...toastData });
    },

    error: (
      message:
        | string
        | { title: string; description?: string; duration?: number },
    ) => {
      const toastData =
        typeof message === 'string' ? { title: message } : message;
      addToast({ type: 'error', ...toastData });
    },

    warning: (
      message:
        | string
        | { title: string; description?: string; duration?: number },
    ) => {
      const toastData =
        typeof message === 'string' ? { title: message } : message;
      addToast({ type: 'warning', ...toastData });
    },

    info: (
      message:
        | string
        | { title: string; description?: string; duration?: number },
    ) => {
      const toastData =
        typeof message === 'string' ? { title: message } : message;
      addToast({ type: 'info', ...toastData });
    },
  };
}
