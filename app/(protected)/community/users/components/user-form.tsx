'use client';

import { FormField, FormSection } from '@/components/ui/form-section';
import { Input, InputAddon, InputGroup } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import AvatarUpload from '@/components/ui/avatar-upload';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { ICommunityUser } from '@/app/actions/community-users';
import { NATIONALITIES } from '@/config/constants';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type SubmitHandler = (values: ICommunityUser) => void | Promise<void>;

interface UserFormProps {
  onSubmit: SubmitHandler;
  initialValues: ICommunityUser;
  onCancel?: () => void;
}

const userSchema = z.object({
  firstName: z.string().min(1, 'Primer nombre es requerido.'),
  secondName: z.string().optional(),
  firstLastName: z.string().min(1, 'Primer apellido es requerido.'),
  secondLastName: z.string().optional(),
  nationality: z.string().min(1, 'Nacionalidad es requerida.'),
  identificationType: z.string().min(1, 'Tipo de identificación es requerido.'),
  identificationNumber: z
    .string()
    .min(1, 'Número de identificación es requerido.'),
  birthDate: z.date({ required_error: 'Fecha de nacimiento es requerida.' }),
  mobilePhone: z.string().min(1, 'Teléfono móvil es requerido.'),
  homePhone: z.string().optional(),
  email: z.string().email('Email inválido').min(1, 'Email es requerido.'),
  residentRole: z.string().min(1, 'Rol de residente es requerido.'),
  adminRole: z.string().min(1, 'Rol de administrador es requerido.'),
  avatarFile: z.instanceof(File).optional(),
  avatarUrl: z.string().optional(),
});

export type UserFormSchema = z.infer<typeof userSchema>;

export function UserForm({ onSubmit, initialValues, onCancel }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: initialValues.firstName || '',
      secondName: initialValues.secondName || '',
      firstLastName: initialValues.firstLastName || '',
      secondLastName: initialValues.secondLastName || '',
      nationality: initialValues.nationality || '',
      identificationType: initialValues.identificationType || '',
      identificationNumber: initialValues.identificationNumber || '',
      birthDate: initialValues.birthDate || new Date(),
      mobilePhone: initialValues.mobilePhone || '',
      homePhone: initialValues.homePhone || '',
      email: initialValues.email || '',
      residentRole: initialValues.residentRole || '',
      adminRole: initialValues.adminRole || '',
      avatarUrl: initialValues.avatar || '',
    },
  });

  const avatarUrl = watch('avatarUrl');

  const onSubmitForm = (data: UserFormSchema) => {
    const userData = {
      ...data,
      id: initialValues.id,
      isPublic: initialValues.isPublic,
      avatar: data.avatarUrl || initialValues.avatar,
      createdAt: initialValues.createdAt,
      updatedAt: initialValues.updatedAt,
      isTrashed: initialValues.isTrashed,
      isProtected: initialValues.isProtected,
      createdByUserId: initialValues.createdByUserId,
      avatarFile: data.avatarFile,
    } as ICommunityUser & { avatarFile?: File };

    return onSubmit(userData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="space-y-8">
        {/* Personal Information */}
        <FormSection
          title="Información de usuario"
          toolbar={
            <div className="flex items-center gap-2.5">
              <span className="text-sm">Perfil público</span>
              <Switch defaultChecked />
            </div>
          }
        >
          <FormField label="Foto">
            <AvatarUpload
              onFileChange={(file) => {
                if (file) {
                  setValue('avatarFile', file.file);
                  // Create preview URL for display
                  setValue('avatarUrl', file.preview);
                } else {
                  setValue('avatarFile', undefined);
                  setValue('avatarUrl', '');
                }
              }}
              defaultAvatar={avatarUrl || initialValues.avatar || undefined}
            />
          </FormField>

          <FormField label="Primer Nombre">
            <div>
              <Input
                {...register('firstName')}
                type="text"
                id="firstName"
                placeholder="Ingresa el primer nombre"
                autoComplete="off"
                disabled={isSubmitting}
                className={`transition-none ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
              />
              {errors.firstName && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </div>
              )}
            </div>
          </FormField>

          <FormField label="Segundo Nombre">
            <div>
              <Input
                {...register('secondName')}
                type="text"
                id="secondName"
                placeholder="Ingresa el segundo nombre"
                autoComplete="off"
                disabled={isSubmitting}
                className="transition-none"
              />
            </div>
          </FormField>

          <FormField label="Primer Apellido">
            <div>
              <Input
                {...register('firstLastName')}
                type="text"
                id="firstLastName"
                placeholder="Ingresa el primer apellido"
                autoComplete="off"
                disabled={isSubmitting}
                className={`transition-none ${
                  errors.firstLastName ? 'border-red-500' : ''
                }`}
              />
              {errors.firstLastName && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.firstLastName.message}
                </div>
              )}
            </div>
          </FormField>

          <FormField label="Segundo Apellido">
            <div>
              <Input
                {...register('secondLastName')}
                type="text"
                id="secondLastName"
                placeholder="Ingresa el segundo apellido"
                autoComplete="off"
                disabled={isSubmitting}
                className="transition-none"
              />
            </div>
          </FormField>

          <FormField label="Nacionalidad">
            <Select onValueChange={(value) => setValue('nationality', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la nacionalidad" />
              </SelectTrigger>
              <SelectContent>
                {NATIONALITIES.map((nationality) => (
                  <SelectItem key={nationality} value={nationality}>
                    {nationality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.nationality && (
              <div className="text-red-500 text-sm mt-1">
                {errors.nationality.message}
              </div>
            )}
          </FormField>

          <FormField label="Tipo de identificación">
            <Select
              onValueChange={(value) => setValue('identificationType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de identificación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cédula">Cédula</SelectItem>
                <SelectItem value="Pasaporte">Pasaporte</SelectItem>
              </SelectContent>
            </Select>
            {errors.identificationType && (
              <div className="text-red-500 text-sm mt-1">
                {errors.identificationType.message}
              </div>
            )}
          </FormField>

          <FormField label="Número de identificación">
            <div>
              <Input
                {...register('identificationNumber')}
                type="text"
                placeholder="Ingresa el número de identificación"
                autoComplete="off"
                disabled={isSubmitting}
                className={`transition-none ${
                  errors.identificationNumber ? 'border-red-500' : ''
                }`}
              />
              {errors.identificationNumber && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.identificationNumber.message}
                </div>
              )}
            </div>
          </FormField>

          <FormField label="Fecha de nacimiento">
            <InputGroup>
              <InputAddon mode="icon">
                <Calendar />
              </InputAddon>
              <Input
                {...register('birthDate', {
                  setValueAs: (value) => new Date(value),
                })}
                type="date"
                placeholder="DD/MM/YYYY"
                className={`transition-none ${
                  errors.birthDate ? 'border-red-500' : ''
                }`}
              />
            </InputGroup>
            {errors.birthDate && (
              <div className="text-red-500 text-sm mt-1">
                {errors.birthDate.message}
              </div>
            )}
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
                {...register('mobilePhone')}
                type="text"
                placeholder="Ej: 998766265"
                className={`flex-1 h-10 bg-white rounded-l-none shadow-sm transition-none ${
                  errors.mobilePhone ? 'border-red-500' : ''
                }`}
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>
            {errors.mobilePhone && (
              <div className="text-red-500 text-sm mt-1">
                {errors.mobilePhone.message}
              </div>
            )}
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
                {...register('homePhone')}
                type="text"
                placeholder="Ej: 22524226"
                className="flex-1 h-10 bg-white rounded-l-none shadow-sm transition-none"
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>
          </FormField>

          <FormField label="Correo electrónico">
            <div>
              <Input
                {...register('email')}
                type="email"
                placeholder="Ingresa correo electrónico"
                autoComplete="off"
                disabled={isSubmitting}
                className={`transition-none ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </div>
              )}
            </div>
          </FormField>
        </FormSection>

        {/* Role Information */}
        <FormSection title="Rol">
          <FormField label="Residente">
            <ToggleGroup
              type="single"
              onValueChange={(value) => {
                if (value) setValue('residentRole', value);
              }}
            >
              <ToggleGroupItem value="Propietario" className="cursor-pointer">
                Propietario
              </ToggleGroupItem>
              <ToggleGroupItem value="Inquilino" className="cursor-pointer">
                Inquilino
              </ToggleGroupItem>
            </ToggleGroup>
            {errors.residentRole && (
              <div className="text-red-500 text-sm mt-1">
                {errors.residentRole.message}
              </div>
            )}
          </FormField>

          <FormField label="Administración">
            <ToggleGroup
              type="single"
              onValueChange={(value) => {
                if (value) setValue('adminRole', value);
              }}
            >
              <ToggleGroupItem value="Admin" className="cursor-pointer">
                Administrador
              </ToggleGroupItem>
              <ToggleGroupItem value="Usuario" className="cursor-pointer">
                Usuario
              </ToggleGroupItem>
            </ToggleGroup>
            {errors.adminRole && (
              <div className="text-red-500 text-sm mt-1">
                {errors.adminRole.message}
              </div>
            )}
          </FormField>
        </FormSection>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-2.5 mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={onCancel}
          type="button"
          className="h-10 px-4 text-sm font-medium bg-white"
        >
          Cancelar
        </Button>
        <Button
          size="lg"
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-4 text-sm font-medium bg-[#1379F0] text-white"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
