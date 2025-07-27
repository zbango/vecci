'use client';

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { FormField, FormSection } from '@/components/ui/form-section';
import { Shield, X } from 'lucide-react';

import AvatarUpload from '@/components/ui/avatar-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface HeadquarterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HeadquarterDialog({
  open,
  onOpenChange,
}: HeadquarterDialogProps) {
  const [showAlert, setShowAlert] = useState(false);

  const handleSave = () => {
    onOpenChange(false);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

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
                <DialogTitle className="text-xl">Sede</DialogTitle>
                <p className="text-sm">Ingresa los datos de la nueva sede</p>
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

            <div className="space-y-8">
              {/* Sede Information */}
              <FormSection
                title="Información de la sede"
                toolbar={
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">Perfil público</span>
                    <Switch defaultChecked />
                  </div>
                }
              >
                <FormField label="Foto">
                  <div className="flex items-center justify-between">
                    <p className="text-xs">Formato: JPEG o PNG / Peso: 10MB</p>
                    <AvatarUpload />
                  </div>
                </FormField>

                <FormField label="Tipo de sede">
                  <Input
                    placeholder="Selecciona el tipo de sede"
                    className="h-10"
                  />
                </FormField>

                <FormField label="Nombre o número de la sede">
                  <Input
                    placeholder="Ingresa el nombre o número de la sede"
                    className="h-10"
                  />
                </FormField>

                <FormField label="Dirección de la sede">
                  <Input
                    placeholder="Ingresa la dirección de la sede"
                    className="h-10"
                  />
                </FormField>

                <FormField label="Referencia">
                  <Input placeholder="Ingresa la referencia" className="h-10" />
                </FormField>
              </FormSection>

              {/* Contact Information */}
              <FormSection title="Información de Contacto">
                <FormField label="Telefono móvil">
                  <div className="flex">
                    <div className="flex items-center gap-2 px-3 py-2 border border-r-0 rounded-l-md">
                      <img
                        src="/media/flags/ecuador.svg"
                        alt="Ecuador"
                        className="w-4 h-4 object-cover rounded-full"
                      />
                      <span className="text-xs">EC (+593)</span>
                    </div>
                    <Input
                      placeholder="Ej: 998766265"
                      className="flex-1 h-10  bg-white rounded-l-none shadow-sm"
                    />
                  </div>
                </FormField>

                <FormField label="Telefono fijo">
                  <div className="flex">
                    <div className="flex items-center gap-2 px-3 py-2 border border-r-0 rounded-l-md">
                      <img
                        src="/media/flags/ecuador.svg"
                        alt="Ecuador"
                        className="w-4 h-4 object-cover rounded-full"
                      />
                      <span className="text-xs ">EC (+593)</span>
                    </div>
                    <Input
                      placeholder="Ej: 22524226"
                      className="flex-1 h-10  bg-white rounded-l-none shadow-sm"
                    />
                  </div>
                </FormField>

                <FormField label="Correo electrónico">
                  <Input
                    placeholder="Ingresa correo electrónico"
                    className="h-10"
                  />
                </FormField>
              </FormSection>

              {/* User Assignment */}
              <FormSection title="Administración">
                <FormField label="Cargo">
                  <Input
                    placeholder="Selecciona el nombre del propietario"
                    className="h-10"
                  />
                </FormField>

                <FormField label="Usuario">
                  <Input
                    placeholder="Selecciona el nombre del inquilino"
                    className="h-10"
                  />
                </FormField>
              </FormSection>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-2.5 mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => onOpenChange(false)}
                className="h-10 px-4 text-sm font-medium   bg-white"
              >
                Cancelar
              </Button>
              <Button
                size="lg"
                onClick={handleSave}
                className="h-10 px-4 text-sm font-medium bg-[#1379F0]"
              >
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Alert */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 w-[400px]">
          <Alert className="bg-[#E1FCE9] border-[#0BC33F] border rounded-lg p-4">
            <AlertIcon className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#0BC33F]" />
            </AlertIcon>
            <AlertContent className="ml-4">
              <AlertTitle className="text-[#27314B] font-semibold text-[15px] leading-tight">
                ¡Unidad creada con éxito!
              </AlertTitle>
              <AlertDescription className=" text-sm font-medium mt-1">
                La unidad se registró correctamente.
              </AlertDescription>
            </AlertContent>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAlert(false)}
              className="ml-auto p-1 h-7 w-7 bg-white rounded-full hover:bg-gray-50"
            >
              <X className="w-4 h-4 text-[#0BC33F]" />
            </Button>
          </Alert>
        </div>
      )}
    </>
  );
}
