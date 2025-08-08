'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { IHeadquarters } from '@/app/actions/headquarters';
import { HeadquartersForm } from './headquarters-form';

interface HeadquartersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: IHeadquarters;
  onSave: (headquartersData: IHeadquarters) => Promise<void>;
  isReadOnly?: boolean;
}

export function HeadquartersDialog({
  open,
  onOpenChange,
  initialValues,
  onSave,
  isReadOnly = false,
}: HeadquartersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[1000px] max-h-[90vh] overflow-y-auto p-0"
        close={false}
      >
        <div className="p-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col gap-2">
              <DialogTitle className="text-xl">
                {isReadOnly ? 'Ver Sede' : 'Sede'}
              </DialogTitle>
              <p className="text-sm">
                {isReadOnly
                  ? 'Información de la sede'
                  : 'Ingresa los detalles de la sede'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 px-3"
            >
              Cerrar
            </Button>
          </div>
          <HeadquartersForm
            onSubmit={onSave}
            onCancel={() => onOpenChange(false)}
            initialValues={initialValues}
            isReadOnly={isReadOnly}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
