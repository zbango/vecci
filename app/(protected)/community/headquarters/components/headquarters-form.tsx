'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { POSITIONS } from '@/config/constants';
import AvatarUpload from '@/components/ui/avatar-upload';
import { Button } from '@/components/ui/button';
import {
  FormDynamicAssignments,
  FormPhoneInput,
  FormSelect,
  FormTextInput,
  LoadingButton,
} from '@/components/ui/form-components';
import { FormField, FormSection } from '@/components/ui/form-section';
import { Switch } from '@/components/ui/switch';
import {
  getActiveCommunityUsers,
  IHeadquarters,
} from '@/app/actions/headquarters';

// Form schema
const HeadquartersFormSchema = z
  .object({
    avatar: z.string().optional(),
    type: z.string().min(1, 'Tipo es requerido'),
    identification: z.string().min(1, 'Identificación es requerida'),
    address: z.string().min(1, 'Dirección es requerida'),
    reference: z.string().optional(),
    mobilePhone: z.string().min(1, 'Teléfono móvil es requerido'),
    homePhone: z.string().optional(),
    email: z.string().email('Formato de email inválido'),
    assignments: z
      .array(
        z.object({
          communityUserId: z.string().min(1, 'Usuario es requerido'),
          position: z.string().min(1, 'Cargo es requerido'),
        }),
      )
      .default([]),
    avatarFile: z.instanceof(File).optional(),
    avatarUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const ids = (data.assignments || [])
      .map((a) => a.communityUserId)
      .filter(Boolean);
    const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
    if (duplicates.length > 0) {
      (data.assignments || []).forEach((a, idx) => {
        if (a.communityUserId && duplicates.includes(a.communityUserId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Este usuario ya está asignado',
            path: ['assignments', idx, 'communityUserId'],
          });
        }
      });
    }
  });

type HeadquartersFormData = Omit<
  z.infer<typeof HeadquartersFormSchema>,
  'assignments'
> & {
  assignments?: Array<{ communityUserId: string; position: string }>;
};

interface HeadquartersFormProps {
  onSubmit: (data: IHeadquarters) => Promise<void>;
  onCancel: () => void;
  initialValues: IHeadquarters;
  isReadOnly?: boolean;
}

interface CommunityUser {
  id: string;
  firstName: string;
  secondName?: string | null;
  firstLastName: string;
  secondLastName?: string | null;
  email: string;
  avatar?: string | null;
}

export function HeadquartersForm({
  onSubmit,
  onCancel,
  initialValues,
  isReadOnly = false,
}: HeadquartersFormProps) {
  const [communityUsers, setCommunityUsers] = useState<CommunityUser[]>([]);
  const [addAssignmentFn, setAddAssignmentFn] = useState<(() => void) | null>(
    null,
  );

  // Load community users for assignment selector
  useEffect(() => {
    const loadCommunityUsers = async () => {
      try {
        const users = await getActiveCommunityUsers();
        setCommunityUsers(users as unknown as CommunityUser[]);
      } catch (error) {
        console.error('Error loading community users:', error);
      }
    };
    loadCommunityUsers();
  }, []);

  // NOTE: initialization of assignments moved below once form is created

  const form = useForm<HeadquartersFormData>({
    resolver: zodResolver(HeadquartersFormSchema),
    defaultValues: {
      avatar: initialValues.avatar || '',
      type: initialValues.type || '',
      identification: initialValues.identification || '',
      address: initialValues.address || '',
      reference: initialValues.reference || '',
      mobilePhone: initialValues.mobilePhone || '',
      homePhone: initialValues.homePhone || '',
      email: initialValues.email || '',
      assignments: [],
      avatarUrl: initialValues.avatar || '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = form;

  const avatarUrl = watch('avatarUrl');

  const handleFormSubmit = handleSubmit((data) => {
    const headquartersData = {
      ...data,
      userAssignments: (data.assignments || []).map((a) => ({
        communityUserId: a.communityUserId,
        position: a.position,
      })),
      id: initialValues.id,
      createdAt: initialValues.createdAt,
      updatedAt: initialValues.updatedAt,
      isTrashed: initialValues.isTrashed,
      isProtected: initialValues.isProtected,
      createdByUserId: initialValues.createdByUserId,
    } as unknown as IHeadquarters;

    return onSubmit(headquartersData);
  });

  // Initialize assignments into the form
  useEffect(() => {
    const initialAssignments = (initialValues.userAssignments || []).map(
      (assignment) => ({
        communityUserId: assignment.communityUserId,
        position: assignment.position,
      }),
    );
    if (initialAssignments.length === 0) {
      setValue('assignments', [{ communityUserId: '', position: '' }]);
    } else {
      setValue('assignments', initialAssignments);
    }
  }, [initialValues.userAssignments, setValue]);

  const handleAddAssignment = () => {
    if (addAssignmentFn) addAssignmentFn();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="space-y-8">
        <FormSection
          title="Información de la Sede"
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
          <FormField label="Tipo de Sede">
            <FormSelect
              value={watch('type')}
              onValueChange={(value) => setValue('type', value)}
              error={errors.type}
              options={[
                { value: 'Bodega', label: 'Bodega' },
                { value: 'Casa', label: 'Casa' },
                {
                  value: 'Conjunto residencial',
                  label: 'Conjunto residencial',
                },
                { value: 'Departamento', label: 'Departamento' },
                { value: 'Edificio', label: 'Edificio' },
                { value: 'Parqueadero', label: 'Parqueadero' },
              ]}
              placeholder="Selecciona el tipo de sede"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>

          <FormField label="Nombre o número de la sede">
            <FormTextInput
              register={register('identification')}
              error={errors.identification}
              placeholder="Ingresa el nombre o número de la sede"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>

          <FormField label="Dirección de la sede">
            <FormTextInput
              register={register('address')}
              error={errors.address}
              placeholder="Ingresa la dirección de la sede"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>

          <FormField label="Referencia">
            <FormTextInput
              register={register('reference')}
              error={errors.reference}
              placeholder="Ingresa una referencia (opcional)"
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

        <FormSection
          title="Asignación de Usuarios"
          toolbar={
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="primary"
                appearance="ghost"
                onClick={handleAddAssignment}
                disabled={isSubmitting || isReadOnly}
              >
                Agregar
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          }
        >
          <FormDynamicAssignments
            control={form.control}
            name={'assignments'}
            defaultItem={{ communityUserId: '', position: '' }}
            minItems={1}
            showAddButton={false}
            onRegisterAdd={(fn) => setAddAssignmentFn(() => fn)}
            disabled={isSubmitting || isReadOnly}
            renderItem={({ index, disabled: d }) => (
              <>
                <div className="flex items-center gap-10 px-8 py-2.5">
                  <div className="w-[220px]">
                    <span className="text-sm font-normal">Cargo</span>
                  </div>
                  <div className="flex-1">
                    <FormSelect
                      value={form.watch(
                        `assignments.${index}.position` as const,
                      )}
                      onValueChange={(v) =>
                        form.setValue(
                          `assignments.${index}.position` as const,
                          v,
                        )
                      }
                      options={POSITIONS.map((p: string) => ({
                        value: p,
                        label: p,
                      }))}
                      placeholder="Selecciona el cargo"
                      disabled={d}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-10 px-8 py-2.5">
                  <div className="w-[220px]">
                    <span className="text-sm font-normal">Usuario</span>
                  </div>
                  <div className="flex-1">
                    <FormSelect
                      value={form.watch(
                        `assignments.${index}.communityUserId` as const,
                      )}
                      onValueChange={(v) =>
                        form.setValue(
                          `assignments.${index}.communityUserId` as const,
                          v,
                        )
                      }
                      options={communityUsers
                        .filter((u) => {
                          const selectedIds = (form.watch('assignments') || [])
                            .map((a) => a.communityUserId)
                            .filter(Boolean);
                          const current = form.watch(
                            `assignments.${index}.communityUserId` as const,
                          );
                          // allow current selection to remain visible
                          return (
                            !selectedIds.includes(u.id) || u.id === current
                          );
                        })
                        .map((u) => ({
                          value: u.id,
                          label:
                            `${u.firstName ?? ''} ${u.secondName ?? ''} ${u.firstLastName ?? ''} ${u.secondLastName ?? ''}`
                              .replace(/\s+/g, ' ')
                              .trim(),
                        }))}
                      placeholder="Selecciona un usuario"
                      disabled={d}
                    />
                  </div>
                </div>
              </>
            )}
          />
        </FormSection>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-2.5 mt-8">
        <LoadingButton
          variant="outline"
          size="lg"
          onClick={onCancel}
          className="h-10 px-4 text-sm font-medium bg-white"
        >
          Cancelar
        </LoadingButton>
        {!isReadOnly && (
          <LoadingButton
            size="lg"
            type="submit"
            isLoading={isSubmitting}
            loadingText="Guardando..."
            className="h-10 px-4 text-sm font-medium bg-[#1379F0] text-white"
          >
            Guardar
          </LoadingButton>
        )}
      </div>
    </form>
  );
}
