import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold text-[#111B37]">{title}</h1>
        {description && (
          <span className="text-[15px] text-[#4B5675] leading-6">
            {description}
          </span>
        )}
      </div>
      {actions && <div className="flex gap-2.5">{actions}</div>}
    </div>
  );
}
