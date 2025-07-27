'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { ICommunityUser } from '@/app/actions/community-users';
import { UserForm } from './user-form';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: ICommunityUser;
  onSave: (userData: ICommunityUser) => Promise<void>;
}

export function UserDialog({
  open,
  onOpenChange,
  initialValues,
  onSave,
}: UserDialogProps) {
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
                <DialogTitle className="text-xl">Usuario</DialogTitle>
                <p className="text-sm">Ingresa los datos del nuevo usuario</p>
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
            <UserForm
              onSubmit={onSave}
              onCancel={() => onOpenChange(false)}
              initialValues={initialValues}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
