'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { IUnit } from '@/app/actions/units';
import { UnitForm } from './unit-form';

interface UnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: IUnit | any;
  onSave: (unitData: any) => Promise<void>;
  isReadOnly?: boolean;
}

export function UnitDialog({
  open,
  onOpenChange,
  initialValues,
  onSave,
  isReadOnly = false,
}: UnitDialogProps) {
  return (
    <>
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
                  {isReadOnly ? 'Ver Unidad' : 'Unidad'}
                </DialogTitle>
                <p className="text-sm">
                  {isReadOnly
                    ? 'Información de la unidad'
                    : 'Ingresa los datos de la nueva unidad'}
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
            <UnitForm
              onSubmit={onSave}
              onCancel={() => onOpenChange(false)}
              initialValues={initialValues}
              isReadOnly={isReadOnly}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
