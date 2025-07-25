import {
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';

import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  toolbar?: ReactNode;
  className?: string;
}

export function FormSection({ title, children, toolbar, className }: FormSectionProps) {
  return (
    <Card className={`shadow-sm ${className || ''}`}>
      <CardHeader>
        <CardHeading>
          <CardTitle className="px-4">{title}</CardTitle>
        </CardHeading>
        {toolbar && <CardToolbar>{toolbar}</CardToolbar>}
      </CardHeader>
      <CardContent className="px-2 py-4">
        {children}
      </CardContent>
    </Card>
  );
}

interface FormFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={`flex items-center gap-10 px-8 py-2.5 ${className || ''}`}>
      <div className="w-[220px]">
        <span className="text-sm font-normal">{label}</span>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 