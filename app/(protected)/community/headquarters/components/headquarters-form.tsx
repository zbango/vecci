'use client';

import {
  FormDynamicAssignments,
  FormPhoneInput,
  FormSelect,
  FormTextInput,
  LoadingButton,
} from '@/components/ui/form-components';
import { FormField, FormSection } from '@/components/ui/form-section';
import {
  IHeadquarters,
  getActiveCommunityUsers,
} from '@/app/actions/headquarters';
import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Form schema
const HeadquartersFormSchema = z.object({
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
    .optional()
    .default([]),
});

type HeadquartersFormData = z.infer<typeof HeadquartersFormSchema>;

interface HeadquartersFormProps {
  onSubmit: (data: IHeadquarters) => Promise<void>;
  onCancel: () => void;
  initialValues: IHeadquarters;
  isReadOnly?: boolean;
}

interface CommunityUser {
  id: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  email: string;
  avatar?: string;
}

export function HeadquartersForm({
  onSubmit,
  onCancel,
  initialValues,
  isReadOnly = false,
}: HeadquartersFormProps) {
  const [communityUsers, setCommunityUsers] = useState<CommunityUser[]>([]);
  const [assignments, setAssignments] = useState<
    Array<{ communityUserId: string; position: string }>
  >([]);

  // Load community users for assignment selector
  useEffect(() => {
    const loadCommunityUsers = async () => {
      try {
        const users = await getActiveCommunityUsers();
        setCommunityUsers(users);
      } catch (error) {
        console.error('Error loading community users:', error);
      }
    };
    loadCommunityUsers();
  }, []);

  // Initialize assignments from initial values
  useEffect(() => {
    if (initialValues.userAssignments) {
      const initialAssignments = initialValues.userAssignments.map(
        (assignment) => ({
          communityUserId: assignment.communityUserId,
          position: assignment.position,
        }),
      );
      setAssignments(initialAssignments);
    }
  }, [initialValues.userAssignments]);

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
      assignments: assignments,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = form;

  const handleFormSubmit = handleSubmit((data) => {
    const headquartersData = {
      ...data,
      assignments: assignments, // Use the local state for assignments
      id: initialValues.id,
      createdAt: initialValues.createdAt,
      updatedAt: initialValues.updatedAt,
      isTrashed: initialValues.isTrashed,
      isProtected: initialValues.isProtected,
      createdByUserId: initialValues.createdByUserId,
    } as IHeadquarters;

    return onSubmit(headquartersData);
  });

  const handleAssignmentsChange = (
    newAssignments: Array<{ communityUserId: string; position: string }>,
  ) => {
    setAssignments(newAssignments);
    setValue('assignments', newAssignments);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="space-y-8">
        <FormSection title="Información de la Sede">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Tipo de Sede">
              <FormSelect
                value={watch('type')}
                onValueChange={(value) => setValue('type', value)}
                error={errors.type}
                options={[
                  { value: 'principal', label: 'Sede Principal' },
                  { value: 'secundaria', label: 'Sede Secundaria' },
                  { value: 'temporal', label: 'Sede Temporal' },
                ]}
                placeholder="Selecciona el tipo de sede"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>

            <FormField label="Identificación">
              <FormTextInput
                register={register('identification')}
                error={errors.identification}
                placeholder="Ingresa la identificación"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>

            <FormField label="Email">
              <FormTextInput
                register={register('email')}
                error={errors.email}
                type="email"
                placeholder="Ingresa el email"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>

            <FormField label="Teléfono Móvil">
              <FormPhoneInput
                register={register('mobilePhone')}
                error={errors.mobilePhone}
                placeholder="Ingresa el teléfono móvil"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>

            <FormField label="Teléfono Fijo">
              <FormPhoneInput
                register={register('homePhone')}
                error={errors.homePhone}
                placeholder="Ingresa el teléfono fijo"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Dirección">
          <div className="grid grid-cols-1 gap-6">
            <FormField label="Dirección">
              <FormTextInput
                register={register('address')}
                error={errors.address}
                placeholder="Ingresa la dirección completa"
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
          </div>
        </FormSection>

        <FormSection title="Asignación de Usuarios">
          <FormDynamicAssignments
            assignments={assignments}
            onAssignmentsChange={handleAssignmentsChange}
            communityUsers={communityUsers}
            error={errors.assignments}
            disabled={isSubmitting || isReadOnly}
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
