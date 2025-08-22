'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UNIT_TYPES } from '@/config/constants';
import AvatarUpload from '@/components/ui/avatar-upload';
import { Button } from '@/components/ui/button';
import {
  FormDynamicAssignments,
  FormSelect,
  FormTextInput,
  LoadingButton,
} from '@/components/ui/form-components';
import { FormField, FormSection } from '@/components/ui/form-section';
import { Switch } from '@/components/ui/switch';
import {
  getActiveCommunityUsersByResidentRole,
  getActiveHeadquartersForSelect,
} from '@/app/actions/units';

type SubmitHandler = (values: any) => void | Promise<void>;

interface UnitFormProps {
  onSubmit: SubmitHandler;
  initialValues: any;
  onCancel?: () => void;
  isReadOnly?: boolean;
}

const unitSchema = z.object({
  avatarFile: z.instanceof(File).optional(),
  avatarUrl: z.string().optional(),
  type: z.string().min(1, 'Tipo de unidad es requerido.'),
  identification: z.string().min(1, 'Identificación es requerida'),
  area: z.coerce.number().int().min(1, 'Metraje es requerido'),
  headquartersId: z.string().min(1, 'Sede es requerida'),
  reference: z.string().optional(),
  ownerId: z.string().optional().nullable(),
  tenantId: z.string().optional().nullable(),
  spaces: z
    .array(
      z.object({
        type: z.string().min(1, 'Tipo es requerido'),
        identification: z.string().min(1, 'Nombre o número es requerido'),
        area: z.coerce.number().int().min(1, 'Metraje es requerido'),
        reference: z.string().optional(),
        ownerId: z.string().optional().nullable(),
        tenantId: z.string().optional().nullable(),
      }),
    )
    .default([]),
});

export type UnitFormSchema = z.infer<typeof unitSchema>;
type UnitFormData = Omit<UnitFormSchema, 'spaces'> & {
  spaces?: Array<{
    type: string;
    identification: string;
    area: number;
    reference?: string;
    ownerId?: string | null;
    tenantId?: string | null;
  }>;
};

export function UnitForm({
  onSubmit,
  initialValues,
  onCancel,
  isReadOnly = false,
}: UnitFormProps) {
  const [headquartersOptions, setHeadquartersOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [ownerOptions, setOwnerOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [tenantOptions, setTenantOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [addSpace, setAddSpace] = useState<(() => void) | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const hqs = await getActiveHeadquartersForSelect();
      setHeadquartersOptions(
        hqs.map((h) => ({ value: h.id, label: `${h.identification}` })),
      );
      const owners = await getActiveCommunityUsersByResidentRole('Propietario');
      setOwnerOptions(
        owners.map((u) => ({
          value: u.id,
          label:
            `${u.firstName ?? ''} ${u.secondName ?? ''} ${u.firstLastName ?? ''} ${u.secondLastName ?? ''}`
              .replace(/\s+/g, ' ')
              .trim(),
        })),
      );
      const tenants = await getActiveCommunityUsersByResidentRole('Inquilino');
      setTenantOptions(
        tenants.map((u) => ({
          value: u.id,
          label:
            `${u.firstName ?? ''} ${u.secondName ?? ''} ${u.firstLastName ?? ''} ${u.secondLastName ?? ''}`
              .replace(/\s+/g, ' ')
              .trim(),
        })),
      );
    };
    loadData();
  }, []);

  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      avatarUrl: initialValues.avatar || '',
      type: initialValues.type || '',
      identification: initialValues.identification || '',
      area: initialValues.area || 0,
      headquartersId: initialValues.headquartersId || '',
      reference: initialValues.reference || '',
      ownerId: initialValues.ownerId || null,
      tenantId: initialValues.tenantId || null,
      spaces: initialValues.spaces || [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = form;

  const avatarUrl = watch('avatarUrl');

  const handleFormSubmit = handleSubmit((data: UnitFormData) => {
    const payload = {
      avatar: data.avatarUrl || initialValues.avatar || null,
      type: data.type,
      identification: data.identification,
      area: data.area,
      headquartersId: data.headquartersId,
      reference: data.reference || null,
      ownerId: data.ownerId || null,
      tenantId: data.tenantId || null,
      additionalSpaces: (
        (data.spaces || []) as NonNullable<UnitFormData['spaces']>
      ).map((s) => ({
        type: s.type,
        identification: s.identification,
        area: s.area,
        reference: s.reference || null,
        ownerId: s.ownerId || null,
        tenantId: s.tenantId || null,
      })),
    };

    return onSubmit(payload);
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="space-y-8">
        {/* Unit Information */}
        <FormSection
          title="Información de la unidad"
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

          <FormField label="Tipo de unidad">
            <FormSelect
              value={watch('type')}
              onValueChange={(value) => setValue('type', value)}
              error={errors.type as any}
              options={UNIT_TYPES}
              placeholder="Selecciona el tipo de unidad"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>

          <FormField label="Nombre o número de la unidad">
            <FormTextInput
              register={register('identification')}
              error={errors.identification as any}
              placeholder="Ingresa el nombre o número de la unidad"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>

          <FormField label="Metraje (m²)">
            <FormTextInput
              register={register('area')}
              error={errors.area as any}
              placeholder="Ingresa el metraje de la unidad"
              disabled={isSubmitting || isReadOnly}
              type="number"
            />
          </FormField>

          <FormField label="Sede">
            <FormSelect
              value={watch('headquartersId')}
              onValueChange={(value) => setValue('headquartersId', value)}
              error={errors.headquartersId as any}
              options={headquartersOptions}
              placeholder="Selecciona la sede"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>

          <FormField label="Referencia">
            <FormTextInput
              register={register('reference')}
              error={errors.reference as any}
              placeholder="Ingresa la referencia de la unidad"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>
          <FormField label="Propietario">
            <FormSelect
              value={watch('ownerId') || ''}
              onValueChange={(value) => setValue('ownerId', value)}
              options={ownerOptions}
              placeholder="Selecciona propietario (opcional)"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>

          <FormField label="Inquilino">
            <FormSelect
              value={watch('tenantId') || ''}
              onValueChange={(value) => setValue('tenantId', value)}
              options={tenantOptions}
              placeholder="Selecciona inquilino (opcional)"
              disabled={isSubmitting || isReadOnly}
            />
          </FormField>
        </FormSection>

        <FormSection
          title="Espacios adicionales"
          toolbar={
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="primary"
                appearance="ghost"
                onClick={() => addSpace && addSpace()}
                disabled={isSubmitting || isReadOnly}
              >
                Agregar
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          }
        >
          <FormDynamicAssignments
            control={form.control as any}
            name={'spaces'}
            defaultItem={
              {
                type: '',
                identification: '',
                area: 0,
                reference: '',
                ownerId: null,
                tenantId: null,
              } as any
            }
            minItems={0}
            showAddButton={false}
            onRegisterAdd={(fn) => setAddSpace(() => fn)}
            disabled={isSubmitting || isReadOnly}
            renderItem={({ index, disabled: d }) => (
              <>
                <div className="flex items-center gap-10 px-8 py-2.5">
                  <div className="w-[220px]">
                    <span className="text-sm font-normal">Tipo</span>
                  </div>
                  <div className="flex-1">
                    <FormSelect
                      value={watch(`spaces.${index}.type` as const)}
                      onValueChange={(v) =>
                        setValue(`spaces.${index}.type` as const, v)
                      }
                      options={UNIT_TYPES}
                      placeholder="Selecciona el tipo"
                      disabled={d}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-10 px-8 py-2.5">
                  <div className="w-[220px]">
                    <span className="text-sm font-normal">Nombre o número</span>
                  </div>
                  <div className="flex-1">
                    <FormTextInput
                      register={register(
                        `spaces.${index}.identification` as const,
                      )}
                      placeholder="Ingresa nombre o número"
                      disabled={d}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-10 px-8 py-2.5">
                  <div className="w-[220px]">
                    <span className="text-sm font-normal">Metraje (m²)</span>
                  </div>
                  <div className="flex-1">
                    <FormTextInput
                      register={register(`spaces.${index}.area` as const)}
                      type="number"
                      placeholder="Ingresa metraje"
                      disabled={d}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-10 px-8 py-2.5">
                  <div className="w-[220px]">
                    <span className="text-sm font-normal">Referencia</span>
                  </div>
                  <div className="flex-1">
                    <FormTextInput
                      register={register(`spaces.${index}.reference` as const)}
                      placeholder="Referencia (opcional)"
                      disabled={d}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-10 px-8 py-2.5">
                  <div className="w-[220px]">
                    <span className="text-sm font-normal">Propietario</span>
                  </div>
                  <div className="flex-1">
                    <FormSelect
                      value={watch(`spaces.${index}.ownerId` as const) || ''}
                      onValueChange={(v) =>
                        setValue(`spaces.${index}.ownerId` as const, v)
                      }
                      options={ownerOptions}
                      placeholder="Selecciona propietario (opcional)"
                      disabled={d}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-10 px-8 py-2.5">
                  <div className="w-[220px]">
                    <span className="text-sm font-normal">Inquilino</span>
                  </div>
                  <div className="flex-1">
                    <FormSelect
                      value={watch(`spaces.${index}.tenantId` as const) || ''}
                      onValueChange={(v) =>
                        setValue(`spaces.${index}.tenantId` as const, v)
                      }
                      options={tenantOptions}
                      placeholder="Selecciona inquilino (opcional)"
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
