'use client';

import {
  DOCUMENT_TYPES_BY_NATIONALITY,
  NATIONALITIES,
} from '@/config/constants';
import { FormField, FormSection } from '@/components/ui/form-section';
import {
  FormPhoneInput,
  FormSelect,
  FormTextInput,
  FormToggleGroup,
  LoadingButton,
} from '@/components/ui/form-components';

import AvatarUpload from '@/components/ui/avatar-upload';
import { Button } from '@/components/ui/button';
import { ICommunityUser } from '@/app/actions/community-users';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type SubmitHandler = (values: ICommunityUser) => void | Promise<void>;

interface HeadquarterFormProps {
  onSubmit: SubmitHandler;
  initialValues: ICommunityUser;
  onCancel?: () => void;
  isReadOnly?: boolean;
}

const headquarterSchema = z.object({
  firstName: z.string().min(1, 'Primer nombre es requerido.'),
  secondName: z.string().optional(),
  firstLastName: z.string().min(1, 'Primer apellido es requerido.'),
  secondLastName: z.string().optional(),
  nationality: z.string().min(1, 'Nacionalidad es requerida.'),
  identificationType: z.string().min(1, 'Tipo de identificación es requerido.'),
  identificationNumber: z
    .string()
    .min(1, 'Número de identificación es requerido.'),
  mobilePhone: z.string().min(1, 'Teléfono móvil es requerido.'),
  homePhone: z.string().optional(),
  email: z.string().email('Email inválido').min(1, 'Email es requerido.'),
  avatarFile: z.instanceof(File).optional(),
  avatarUrl: z.string().optional(),
});

export type HeadQuarterFormSchema = z.infer<typeof headquarterSchema>;

export function HeadquarterForm({
  onSubmit,
  initialValues,
  onCancel,
  isReadOnly = false,
}: HeadquarterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<HeadQuarterFormSchema>({
    resolver: zodResolver(headquarterSchema),
    defaultValues: {
      avatarUrl: initialValues.avatar || '',
      type: initialValues.type || '',
      identification: initialValues.identification || '',
      address: initialValues.address || '',
      reference: initialValues.reference || '',
      mobilePhone: initialValues.mobilePhone || '',
      homePhone: initialValues.homePhone || '',
      email: initialValues.email || '',
    },
  });

  const avatarUrl = watch('avatarUrl');
  const nationality = watch('nationality');

  const onSubmitForm = (data: HeadQuarterFormSchema) => {
    const userData = {
      ...data,
      id: initialValues.id,
      isPublic: initialValues.isPublic,
      avatar: data.avatarUrl || initialValues.avatar,
      birthDate: new Date(data.birthDate),
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
          title="Información de la sede"
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

          <FormField label="Tipo de sede">
            <FormSelect
              value={nationality || 'Ecuador'}
              onValueChange={(value) => {
                if (!isReadOnly) {
                  setValue('nationality', value);
                  // Reset identification type when nationality changes
                  const defaultDocType =
                    DOCUMENT_TYPES_BY_NATIONALITY[value]?.[0] || 'Cédula';
                  setValue('identificationType', defaultDocType);
                }
              }}
              error={errors.nationality}
              options={NATIONALITIES.map((nationality) => ({
                value: nationality,
                label: nationality,
              }))}
              placeholder="Selecciona la nacionalidad"
              disabled={isReadOnly}
            />
          </FormField>

          <FormField label="Nombre o número de la sede">
            <FormTextInput
              register={register('firstName')}
              error={errors.firstName}
              placeholder="Ingresa el nombre o número de sede"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>

          <FormField label="Dirección de la sede">
            <FormTextInput
              register={register('secondName')}
              placeholder="Ingresa la dirección de la sede"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>

          <FormField label="Referencia">
            <FormTextInput
              register={register('firstLastName')}
              error={errors.firstLastName}
              placeholder="Ingresa la referencia"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>
        </FormSection>

        {/* Contact Information */}
        <FormSection title="Información de Contacto">
          <FormField label="Telefono móvil">
            <FormPhoneInput
              register={register('mobilePhone')}
              error={errors.mobilePhone}
              placeholder="Ej: 998766265"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>

          <FormField label="Telefono fijo">
            <FormPhoneInput
              register={register('homePhone')}
              placeholder="Ej: 22524226"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>

          <FormField label="Correo electrónico">
            <FormTextInput
              register={register('email')}
              error={errors.email}
              type="email"
              placeholder="Ingresa correo electrónico"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>
        </FormSection>

        {/* Role Information */}
        <FormSection title="Rol">
          <FormField label="Residente">
            <FormToggleGroup
              value={watch('residentRole')}
              onValueChange={(value) => {
                if (value && !isReadOnly) setValue('residentRole', value);
              }}
              error={errors.residentRole}
              options={[
                { value: 'Propietario', label: 'Propietario' },
                { value: 'Inquilino', label: 'Inquilino' },
              ]}
              disabled={isReadOnly}
            />
          </FormField>

          <FormField label="Administración">
            <FormToggleGroup
              value={watch('adminRole')}
              onValueChange={(value) => {
                if (value && !isReadOnly) setValue('adminRole', value);
              }}
              error={errors.adminRole}
              options={[
                { value: 'Admin', label: 'Administrador' },
                { value: 'Usuario', label: 'Usuario' },
              ]}
              disabled={isReadOnly}
            />
          </FormField>
        </FormSection>
      </div>

      {/* Footer Actions */}
      {!isReadOnly && (
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
          <LoadingButton
            size="lg"
            type="submit"
            isLoading={isSubmitting}
            loadingText="Guardando..."
          >
            Guardar
          </LoadingButton>
        </div>
      )}
    </form>
  );
}
