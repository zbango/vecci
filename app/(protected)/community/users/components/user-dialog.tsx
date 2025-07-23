'use client';

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Camera, ChevronDown, Shield, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDialog({ open, onOpenChange }: UserDialogProps) {
  const [showAlert, setShowAlert] = useState(false);

  const handleSave = () => {
    // Close the dialog
    onOpenChange(false);
    // Show the success alert
    setShowAlert(true);
    // Auto-hide the alert after 5 seconds
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[1000px] max-h-[90vh] overflow-y-auto p-0">
          <div className="p-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col gap-2">
                <DialogTitle className="text-xl font-semibold text-[#111B37]">
                  Usuario
                </DialogTitle>
                <p className="text-sm text-[#4B5675]">
                  Ingresa los datos del nuevo usuario
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 px-3 text-xs font-medium text-[#4B5675] border-[#DBDFE9]"
              >
                Cerrar
              </Button>
            </div>

            <div className="space-y-8">
              {/* Personal Information */}
              <Card className="border-[#E2E4ED] shadow-sm">
                <CardHeader className="border-b border-[#E2E4ED] py-5 px-8">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold text-[#111B37]">
                      Información de usuario
                    </CardTitle>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm text-[#4B5675]">
                        Perfil público
                      </span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {/* Photo Section */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Foto
                        </Label>
                        <p className="text-xs text-[#4B5675] mt-1">
                          Formato: JPEG o PNG / Peso: 10MB
                        </p>
                      </div>
                      <div className="relative flex-1 flex justify-end">
                        <div className="relative">
                          <Avatar className="w-15 h-15 bg-[#F0F1F6]">
                            <AvatarFallback className="text-lg font-medium text-[#4B5675] bg-[#F0F1F6]">
                              A
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-black/30 rounded-full flex items-center justify-center">
                            <Camera className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* First Name */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Primer Nombre
                        </Label>
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Ingresa el primer nombre"
                          className="h-10 border-[#E2E4ED] bg-white shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Second Name */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Segundo Nombre
                        </Label>
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Ingresa el segundo nombre"
                          className="h-10 border-[#E2E4ED] bg-white shadow-sm"
                        />
                      </div>
                    </div>

                    {/* First Last Name */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Primer Apellido
                        </Label>
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Ingresa el primer apellido"
                          className="h-10 border-[#E2E4ED] bg-white shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Second Last Name */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Segundo Apellido
                        </Label>
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Ingresa el segundo apellido"
                          className="h-10 border-[#E2E4ED] bg-white shadow-sm"
                        />
                      </div>
                    </div>

                    {/* ID Type */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Tipo de identificación
                        </Label>
                      </div>
                      <div className="flex-1">
                        <Select>
                          <SelectTrigger className="h-10 border-[#E2E4ED] bg-white shadow-sm">
                            <SelectValue placeholder="Selecciona el tipo de identificación" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cedula">Cédula</SelectItem>
                            <SelectItem value="pasaporte">Pasaporte</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* ID Number */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Número de identificación
                        </Label>
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Ingresa el número de identificación"
                          className="h-10 border-[#E2E4ED] bg-white shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Nationality */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Nacionalidad
                        </Label>
                      </div>
                      <div className="flex-1">
                        <Select>
                          <SelectTrigger className="h-10 border-[#E2E4ED] bg-white shadow-sm">
                            <SelectValue placeholder="Selecciona la nacionalidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ecuador">Ecuador</SelectItem>
                            <SelectItem value="colombia">Colombia</SelectItem>
                            <SelectItem value="peru">Perú</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Birth Date */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Fecha de nacimiento
                        </Label>
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <Input
                            placeholder="DD/MM/YYYY"
                            className="h-10 border-[#E2E4ED] bg-white shadow-sm pl-10"
                          />
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#78829D]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-[#E2E4ED] shadow-sm">
                <CardHeader className="border-b border-[#E2E4ED] py-5 px-8">
                  <CardTitle className="text-base font-semibold text-[#111B37]">
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {/* Mobile Phone */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Telefono móvil
                        </Label>
                      </div>
                      <div className="flex-1">
                        <div className="flex">
                          <div className="flex items-center gap-2 px-3 py-2 bg-[#F9F9F9] border border-[#DBDFE9] border-r-0 rounded-l-md">
                            <div className="w-4 h-4 bg-red-500 rounded-full" />
                            <span className="text-xs text-[#4B5675]">
                              EC (+593)
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#78829D]" />
                          </div>
                          <Input
                            placeholder="Ej: 99876 6265"
                            className="flex-1 h-10 border-[#E2E4ED] bg-white rounded-l-none shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Landline Phone */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Telefono fijo
                        </Label>
                      </div>
                      <div className="flex-1">
                        <div className="flex">
                          <div className="flex items-center gap-2 px-3 py-2 bg-[#F9F9F9] border border-[#DBDFE9] border-r-0 rounded-l-md">
                            <div className="w-4 h-4 bg-red-500 rounded-full" />
                            <span className="text-xs text-[#4B5675]">
                              EC (+593)
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#78829D]" />
                          </div>
                          <Input
                            placeholder="Ej: 22524 226"
                            className="flex-1 h-10 border-[#E2E4ED] bg-white rounded-l-none shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Correo electrónico
                        </Label>
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Ingresa correo electrónico"
                          className="h-10 border-[#E2E4ED] bg-white shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Role Information */}
              <Card className="border-[#E2E4ED] shadow-sm">
                <CardHeader className="border-b border-[#E2E4ED] py-5 px-8">
                  <CardTitle className="text-base font-semibold text-[#111B37]">
                    Rol
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {/* Resident Role */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Residente
                        </Label>
                      </div>
                      <div className="flex-1">
                        <div className="flex gap-2">
                          <Badge className="bg-[#F0F1F6] text-[#4B5675] px-2 py-1 text-sm font-medium">
                            Propietario
                          </Badge>
                          <Badge className="bg-[#F0F1F6] text-[#4B5675] px-2 py-1 text-sm font-medium">
                            Inquilino
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Administration Role */}
                    <div className="flex items-center gap-10 px-8 py-2.5">
                      <div className="w-[220px]">
                        <Label className="text-sm font-normal text-[#27314B]">
                          Administración
                        </Label>
                      </div>
                      <div className="flex-1">
                        <div className="flex gap-2">
                          <Badge className="bg-[#F0F1F6] text-[#4B5675] px-2 py-1 text-sm font-medium">
                            Administrador
                          </Badge>
                          <Badge className="bg-[#F0F1F6] text-[#4B5675] px-2 py-1 text-sm font-medium">
                            Comite
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-2.5 mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => onOpenChange(false)}
                className="h-10 px-4 text-sm font-medium text-[#4B5675] border-[#E2E4ED] bg-white"
              >
                Cancelar
              </Button>
              <Button
                size="lg"
                onClick={handleSave}
                className="h-10 px-4 text-sm font-medium bg-[#1379F0] text-white"
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
                ¡Usuario creado con éxito!
              </AlertTitle>
              <AlertDescription className="text-[#78829D] text-sm font-medium mt-1">
                El perfil del usuario se registró correctamente.
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
