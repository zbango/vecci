# CRUD Entity Management Pattern - AI Assistant Instructions

## Overview

This document provides comprehensive instructions for implementing CRUD (Create, Read, Update, Delete) entity management patterns in a Next.js application with Prisma, based on the users implementation as the reference architecture.

## Architecture Stack

- **Frontend**: Next.js 14 with React
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Custom components with TanStack Table
- **Forms**: React Hook Form with Zod validation
- **File Storage**: Supabase Storage
- **State Management**: React hooks with server actions

## 1. Database Schema Pattern

### Prisma Model Structure

```prisma
model EntityName {
  id              String   @id @default(uuid())

  // Core business fields
  name            String
  description     String?
  status          String   @default("active")

  // Required metadata fields
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  isTrashed       Boolean  @default(false)
  createdByUserId String?
  isProtected     Boolean  @default(false)

  // Relations
  createdByUser   User?    @relation("EntityCreatedBy", fields: [createdByUserId], references: [id])

  // Performance indexes
  @@index([name])
  @@index([status])
  @@index([createdByUserId])
}
```

### Key Metadata Fields

- `isTrashed`: Soft delete flag (never hard delete)
- `createdByUserId`: Audit trail for who created the record
- `isProtected`: Prevents deletion of important records
- `createdAt/updatedAt`: Timestamp tracking

## 2. Server Actions Implementation

### File Structure

```
app/actions/
└── entity-actions.ts
```

### Action Pattern

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// Type exports
export type IEntity = EntityName; // From Prisma

// Search interface
export interface SearchParams {
  page?: number;
  limit?: number;
  query?: string;
  sort?: string;
  dir?: 'asc' | 'desc';
}

// READ - with pagination, sorting, filtering
export async function getEntities(params: SearchParams = {}) {
  const {
    page = 1,
    limit = 10,
    query = '',
    sort = 'name',
    dir = 'asc',
  } = params;

  const where: Prisma.EntityNameWhereInput = {
    isTrashed: false, // Always filter out trashed items
    ...(query && {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }),
  };

  const total = await prisma.entityName.count({ where });
  const entities = await prisma.entityName.findMany({
    where,
    orderBy: { [sort]: dir as Prisma.SortOrder },
    skip: (page - 1) * limit,
    take: limit,
  });

  return { entities, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// CREATE
export async function createEntity(formData: FormData) {
  const entity = await prisma.entityName.create({
    data: {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      // ... other fields
    },
  });

  revalidatePath('/path/to/entity');
  return entity;
}

// UPDATE
export async function updateEntity(id: string, formData: FormData) {
  const entity = await prisma.entityName.update({
    where: { id },
    data: {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      // ... other fields
    },
  });

  revalidatePath('/path/to/entity');
  return entity;
}

// DELETE (soft delete)
export async function deleteEntity(id: string) {
  await prisma.entityName.update({
    where: { id },
    data: { isTrashed: true },
  });

  revalidatePath('/path/to/entity');
  return { success: true };
}
```

## 3. React Component Implementation

### File Structure

```
app/(protected)/entity/
├── page.tsx
└── components/
    ├── entity-dialog.tsx
    └── entity-form.tsx
```

### Main Page Component

```typescript
'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { DataGrid } from '@/components/ui/data-grid';
import { getEntities, createEntity, updateEntity, deleteEntity, type IEntity } from '@/app/actions/entity-actions';

export default function EntityPage() {
  // State management
  const [data, setData] = useState<EntityData | null>(null);
  const [editingItem, setEditingItem] = useState<IEntity | null>(null);
  const [viewingItem, setViewingItem] = useState<IEntity | null>(null);
  const [deletingItem, setDeletingItem] = useState<IEntity | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);
  const [isPending, startTransition] = useTransition();

  // Table columns definition
  const columns = useMemo<ColumnDef<IEntity>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title="Name" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-medium">{row.original.name}</span>
          </div>
        ),
        size: 290,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'description',
        header: ({ column }) => (
          <DataGridColumnHeader title="Description" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.description}</span>
        ),
        size: 290,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'actions',
        id: 'actions',
        header: () => (
          <div className="flex justify-center w-full">
            <span className="text-sm font-normal">Actions</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-7 w-7" mode="icon" variant="ghost">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start">
                <DropdownMenuItem onClick={() => handleViewItem(row.original)}>
                  <Eye />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditItem(row.original)}>
                  <Pencil />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeletingItem(row.original)}
                >
                  <Trash />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 130,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [],
  );

  // Table configuration
  const table = useReactTable({
    columns,
    data: displayItems,
    pageCount: data?.totalPages || 0,
    getRowId: (row: IEntity) => row.id,
    state: {
      pagination,
      sorting,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableSorting: true,
  });

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      const params: SearchParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        query: searchQuery,
        sort: sorting[0]?.id,
        dir: sorting[0]?.desc ? 'desc' : 'asc',
      };

      const result = await getEntities(params);
      setData(result);
    };

    startTransition(() => {
      fetchData();
    });
  }, [pagination.pageIndex, pagination.pageSize, searchQuery, sorting]);

  // CRUD handlers
  const handleSaveItem = async (itemData: IEntity) => {
    try {
      const formData = new FormData();
      formData.append('name', itemData.name);
      formData.append('description', itemData.description || '');
      // ... append other fields

      if (itemData.id) {
        await updateEntity(itemData.id, formData);
      } else {
        await createEntity(formData);
      }

      // Refresh data
      const params: SearchParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        query: searchQuery,
        sort: sorting[0]?.id,
        dir: sorting[0]?.desc ? 'desc' : 'asc',
      };
      const result = await getEntities(params);
      setData(result);

      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving item:', error);
      throw error;
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;

    try {
      await deleteEntity(deletingItem.id);
      // Refresh data after deletion
      const params: SearchParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        query: searchQuery,
        sort: sorting[0]?.id,
        dir: sorting[0]?.desc ? 'desc' : 'asc',
      };
      const result = await getEntities(params);
      setData(result);
      setDeletingItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="flex flex-col gap-8 px-5 py-8 max-w-[1200px] mx-auto">
      <PageHeader
        title="Entities"
        description="Manage your entities"
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setEditingItem(null);
              setViewingItem(null);
              setDialogOpen(true);
            }}
          >
            New Entity
          </Button>
        }
      />

      <DataGrid
        table={table}
        recordCount={data?.total || 0}
        emptyMessage="No entities found."
        isLoading={isPending}
      >
        <Card>
          <CardHeader className="py-3">
            <CardTitle>
              {isPending
                ? 'Loading...'
                : `Showing ${data?.entities?.length || 0} of ${data?.total || 0} entities`}
            </CardTitle>
            <CardToolbar>
              <InputWrapper>
                <Button
                  size="sm"
                  variant="dim"
                  mode="icon"
                  className="size-5 -ms-0.5"
                >
                  <Search />
                </Button>
                <Input
                  type="text"
                  placeholder="Search entities"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputWrapper>
            </CardToolbar>
          </CardHeader>
          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </Card>
      </DataGrid>

      <EntityDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingItem(null);
            setViewingItem(null);
          }
        }}
        initialValues={editingItem || viewingItem || initialValues}
        onSave={handleSaveItem}
        isReadOnly={!!viewingItem}
      />

      <ConfirmationDialog
        open={!!deletingItem}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeletingItem(null);
        }}
        title="Delete Entity"
        description={
          deletingItem
            ? `Are you sure you want to delete ${deletingItem.name}? This action cannot be undone.`
            : ''
        }
        onConfirm={handleDeleteItem}
        isLoading={isDeleting}
      />
    </div>
  );
}
```

## 4. Dialog Component

### Entity Dialog

```typescript
'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IEntity } from '@/app/actions/entity-actions';
import { EntityForm } from './entity-form';

interface EntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: IEntity;
  onSave: (entityData: IEntity) => Promise<void>;
  isReadOnly?: boolean;
}

export function EntityDialog({
  open,
  onOpenChange,
  initialValues,
  onSave,
  isReadOnly = false,
}: EntityDialogProps) {
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
                {isReadOnly ? 'View Entity' : 'Entity'}
              </DialogTitle>
              <p className="text-sm">
                {isReadOnly
                  ? 'Entity information'
                  : 'Enter entity details'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 px-3"
            >
              Close
            </Button>
          </div>
          <EntityForm
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
```

## 5. Reusable Form Components

### Form Components Architecture

Create reusable form components to maintain consistency and reduce code duplication across all entity forms.

#### File Structure

```
components/ui/
├── form-components.ts          # Central export file
├── form-text-input.tsx        # Text input wrapper
├── form-phone-input.tsx       # Phone input with country code
├── form-date-input.tsx        # Date input with calendar icon
├── form-toggle-group.tsx      # Toggle group wrapper
├── form-select.tsx            # Select dropdown wrapper
└── loading-button.tsx         # Button with loading state
```

#### Central Export File

```typescript
// components/ui/form-components.ts
export { FormTextInput } from './form-text-input';
export { FormPhoneInput } from './form-phone-input';
export { FormDateInput } from './form-date-input';
export { FormToggleGroup } from './form-toggle-group';
export { FormSelect } from './form-select';
export { LoadingButton } from './loading-button';
```

#### Form Text Input Component

```typescript
// components/ui/form-text-input.tsx
'use client';

import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import React from 'react';

interface FormTextInputProps {
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
}

export function FormTextInput({
  register,
  error,
  placeholder,
  type = 'text',
  autoComplete = 'off',
  disabled = false,
  className = '',
}: FormTextInputProps) {
  return (
    <div>
      <Input
        {...register}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`transition-none ${error ? 'border-red-500' : ''} ${className}`}
      />
      {error && (
        <div className="text-red-500 text-sm mt-1">
          {error.message}
        </div>
      )}
    </div>
  );
}
```

#### Form Phone Input Component

```typescript
// components/ui/form-phone-input.tsx
'use client';

import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import React from 'react';

interface FormPhoneInputProps {
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  countryCode?: string;
  countryFlag?: string;
}

export function FormPhoneInput({
  register,
  error,
  placeholder,
  disabled = false,
  className = '',
  countryCode = 'EC (+593)',
  countryFlag = '/media/flags/ecuador.svg',
}: FormPhoneInputProps) {
  return (
    <div>
      <div className="flex">
        <div className="flex items-center gap-2 px-3 py-2 border border-r-0 rounded-l-md">
          <img
            src={countryFlag}
            alt="Country"
            className="w-4 h-4 object-cover rounded-full"
          />
          <span className="text-xs">{countryCode}</span>
        </div>
        <Input
          {...register}
          type="text"
          placeholder={placeholder}
          className={`flex-1 h-10 bg-white rounded-l-none shadow-sm transition-none ${
            error ? 'border-red-500' : ''
          } ${className}`}
          autoComplete="off"
          disabled={disabled}
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-1">
          {error.message}
        </div>
      )}
    </div>
  );
}
```

#### Form Date Input Component

```typescript
// components/ui/form-date-input.tsx
'use client';

import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { Input, InputAddon, InputGroup } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import React from 'react';

interface FormDateInputProps {
  register: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormDateInput({
  register,
  error,
  placeholder = 'DD/MM/YYYY',
  disabled = false,
  className = '',
}: FormDateInputProps) {
  return (
    <div>
      <InputGroup>
        <InputAddon mode="icon">
          <Calendar />
        </InputAddon>
        <Input
          {...register}
          placeholder={placeholder}
          disabled={disabled}
          className={`transition-none ${error ? 'border-red-500' : ''} ${className}`}
        />
      </InputGroup>
      {error && (
        <div className="text-red-500 text-sm mt-1">
          {error.message}
        </div>
      )}
    </div>
  );
}
```

#### Form Toggle Group Component

```typescript
// components/ui/form-toggle-group.tsx
'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FieldError } from 'react-hook-form';
import React from 'react';

interface ToggleOption {
  value: string;
  label: string;
}

interface FormToggleGroupProps {
  value?: string;
  onValueChange: (value: string) => void;
  error?: FieldError;
  options: ToggleOption[];
  disabled?: boolean;
  className?: string;
}

export function FormToggleGroup({
  value,
  onValueChange,
  error,
  options,
  disabled = false,
  className = '',
}: FormToggleGroupProps) {
  return (
    <div>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        className={className}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className="cursor-pointer data-[state=on]:bg-green-500 data-[state=on]:text-white"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {error && (
        <div className="text-red-500 text-sm mt-1">
          {error.message}
        </div>
      )}
    </div>
  );
}
```

#### Form Select Component

```typescript
// components/ui/form-select.tsx
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldError } from 'react-hook-form';
import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  error?: FieldError;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormSelect({
  value,
  onValueChange,
  error,
  options,
  placeholder = 'Selecciona una opción',
  disabled = false,
  className = '',
}: FormSelectProps) {
  return (
    <div>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <div className="text-red-500 text-sm mt-1">
          {error.message}
        </div>
      )}
    </div>
  );
}
```

#### Loading Button Component

```typescript
// components/ui/loading-button.tsx
'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoadingButtonProps extends Omit<ButtonProps, 'children'> {
  children: React.ReactNode;
  loadingText?: string;
  isLoading?: boolean;
  loading?: boolean; // Alias for isLoading for compatibility
}

export function LoadingButton({
  children,
  loadingText = 'Guardando...',
  isLoading = false,
  loading,
  disabled,
  ...props
}: LoadingButtonProps) {
  const isSubmitting = isLoading || loading;

  return (
    <Button
      {...props}
      disabled={disabled || isSubmitting}
      className={`${props.className || ''} ${isSubmitting ? 'cursor-not-allowed' : ''}`}
    >
      {isSubmitting && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {isSubmitting ? loadingText : children}
    </Button>
  );
}
```

## 6. Form Component Implementation

### Entity Form with Reusable Components

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField, FormSection } from '@/components/ui/form-section';
import {
  FormTextInput,
  FormPhoneInput,
  FormDateInput,
  FormToggleGroup,
  FormSelect,
  LoadingButton
} from '@/components/ui/form-components';
import { IEntity } from '@/app/actions/entity-actions';

// Form schema
const EntityFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  secondName: z.string().optional(),
  firstLastName: z.string().min(1, 'First last name is required'),
  secondLastName: z.string().optional(),
  identificationNumber: z.string().min(1, 'Identification number is required'),
  email: z.string().email('Invalid email format'),
  mobilePhone: z.string().min(1, 'Mobile phone is required'),
  birthDate: z.string().optional(),
  nationality: z.string().min(1, 'Nationality is required'),
  identificationType: z.string().min(1, 'Identification type is required'),
  gender: z.string().min(1, 'Gender is required'),
  // ... other fields
});

type EntityFormData = z.infer<typeof EntityFormSchema>;

interface EntityFormProps {
  onSubmit: (data: IEntity) => Promise<void>;
  onCancel: () => void;
  initialValues: IEntity;
  isReadOnly?: boolean;
}

export function EntityForm({
  onSubmit,
  onCancel,
  initialValues,
  isReadOnly = false,
}: EntityFormProps) {
  const form = useForm<EntityFormData>({
    resolver: zodResolver(EntityFormSchema),
    defaultValues: {
      firstName: initialValues.firstName || '',
      secondName: initialValues.secondName || '',
      firstLastName: initialValues.firstLastName || '',
      secondLastName: initialValues.secondLastName || '',
      identificationNumber: initialValues.identificationNumber || '',
      email: initialValues.email || '',
      mobilePhone: initialValues.mobilePhone || '',
      birthDate: initialValues.birthDate || '',
      nationality: initialValues.nationality || '',
      identificationType: initialValues.identificationType || '',
      gender: initialValues.gender || '',
      // ... other fields
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = form;

  const handleFormSubmit = handleSubmit((data) => {
    const entityData = {
      ...data,
      id: initialValues.id,
      createdAt: initialValues.createdAt,
      updatedAt: initialValues.updatedAt,
      isTrashed: initialValues.isTrashed,
      isProtected: initialValues.isProtected,
      createdByUserId: initialValues.createdByUserId,
    } as IEntity;

    return onSubmit(entityData);
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="space-y-8">
        <FormSection title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="First Name">
              <FormTextInput
                register={register('firstName')}
                error={errors.firstName}
                placeholder="Enter first name"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>

            <FormField label="Second Name">
              <FormTextInput
                register={register('secondName')}
                error={errors.secondName}
                placeholder="Enter second name"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>

            <FormField label="First Last Name">
              <FormTextInput
                register={register('firstLastName')}
                error={errors.firstLastName}
                placeholder="Enter first last name"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>

            <FormField label="Second Last Name">
              <FormTextInput
                register={register('secondLastName')}
                error={errors.secondLastName}
                placeholder="Enter second last name"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Email">
              <FormTextInput
                register={register('email')}
                error={errors.email}
                type="email"
                placeholder="Enter email address"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>

            <FormField label="Mobile Phone">
              <FormPhoneInput
                register={register('mobilePhone')}
                error={errors.mobilePhone}
                placeholder="Enter phone number"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Identification">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Identification Type">
              <FormSelect
                value={watch('identificationType')}
                onValueChange={(value) => setValue('identificationType', value)}
                error={errors.identificationType}
                options={[
                  { value: 'cedula', label: 'Cédula' },
                  { value: 'passport', label: 'Pasaporte' },
                  { value: 'foreign_id', label: 'Cédula Extranjera' },
                ]}
                placeholder="Select identification type"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>

            <FormField label="Identification Number">
              <FormTextInput
                register={register('identificationNumber')}
                error={errors.identificationNumber}
                placeholder="Enter identification number"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>

            <FormField label="Nationality">
              <FormSelect
                value={watch('nationality')}
                onValueChange={(value) => setValue('nationality', value)}
                error={errors.nationality}
                options={[
                  { value: 'ecuadorian', label: 'Ecuatoriana' },
                  { value: 'foreign', label: 'Extranjera' },
                ]}
                placeholder="Select nationality"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>

            <FormField label="Birth Date">
              <FormDateInput
                register={register('birthDate')}
                error={errors.birthDate}
                placeholder="DD/MM/YYYY"
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Additional Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Gender">
              <FormToggleGroup
                value={watch('gender')}
                onValueChange={(value) => setValue('gender', value)}
                error={errors.gender}
                options={[
                  { value: 'male', label: 'Masculino' },
                  { value: 'female', label: 'Femenino' },
                ]}
                disabled={isSubmitting || isReadOnly}
              />
            </FormField>
          </div>
        </FormSection>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-2.5 mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={onCancel}
          className="h-10 px-4 text-sm font-medium bg-white"
        >
          Cancel
        </Button>
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
```

## 6. File Upload Pattern

### Server Action with File Upload

```typescript
import { deleteImage, uploadImage } from '@/lib/supabase-storage';

export async function createEntityWithFile(formData: FormData) {
  try {
    // Handle file upload if provided
    let fileUrl = '';
    const file = formData.get('file') as File | null;

    if (file && file instanceof File && file.size > 0) {
      try {
        const result = await uploadImage({
          file,
          bucket: 'bucket-name',
          folder: 'entity-folder',
        });
        fileUrl = result.imageUrl;
      } catch (uploadError) {
        console.error('Failed to upload file:', uploadError);
        // Continue without file if upload fails
      }
    }

    const entity = await prisma.entityName.create({
      data: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        ...(fileUrl && { fileUrl }),
        // ... other fields
      },
    });

    revalidatePath('/path/to/entity');
    return entity;
  } catch (error) {
    console.error('Error creating entity:', error);
    throw new Error('Failed to create entity');
  }
}

export async function updateEntityWithFile(id: string, formData: FormData) {
  try {
    // Get current entity to check existing file
    const currentEntity = await prisma.entityName.findUnique({
      where: { id },
      select: { fileUrl: true },
    });

    // Handle file upload if provided
    let fileUrl = currentEntity?.fileUrl || '';
    const file = formData.get('file') as File | null;

    if (file && file instanceof File && file.size > 0) {
      try {
        // Delete old file if it exists
        if (currentEntity?.fileUrl) {
          try {
            await deleteImage(currentEntity.fileUrl);
          } catch (deleteError) {
            console.error('Failed to delete old file:', deleteError);
          }
        }

        // Upload new file
        const result = await uploadImage({
          file,
          bucket: 'bucket-name',
          folder: 'entity-folder',
        });
        fileUrl = result.imageUrl;
      } catch (uploadError) {
        console.error('Failed to upload file:', uploadError);
        // Keep existing file if upload fails
      }
    }

    const entity = await prisma.entityName.update({
      where: { id },
      data: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        ...(fileUrl && { fileUrl }),
        // ... other fields
      },
    });

    revalidatePath('/path/to/entity');
    return entity;
  } catch (error) {
    console.error('Error updating entity:', error);
    throw new Error('Failed to update entity');
  }
}
```

## 7. Reusable Form Components Benefits

### Why Use Reusable Form Components?

1. **Consistency** - All forms look and behave the same way
2. **Maintainability** - Changes to form styling/behavior in one place
3. **Developer Experience** - Faster form development with pre-built components
4. **Error Handling** - Standardized error display across all forms
5. **Accessibility** - Built-in accessibility features in all components
6. **Type Safety** - Full TypeScript support with proper interfaces
7. **Performance** - Optimized components with proper memoization
8. **Testing** - Easier to test individual components vs. entire forms

### Component Features

- **FormTextInput**: Text inputs with error display and validation
- **FormPhoneInput**: Phone inputs with country code and flag
- **FormDateInput**: Date inputs with calendar icon
- **FormToggleGroup**: Toggle selections with custom styling
- **FormSelect**: Dropdown selects with options array
- **LoadingButton**: Buttons with loading spinner and text

### Integration with React Hook Form

All components are designed to work seamlessly with React Hook Form:

- Accept `register` prop for form integration
- Display `error` prop for validation feedback
- Support `disabled` prop for form states
- Handle `watch` and `setValue` for controlled components

## 8. Key Implementation Rules

### Database Rules

1. **Always use soft deletes** - Never hard delete records
2. **Include audit fields** - `createdByUserId`, `createdAt`, `updatedAt`
3. **Add protection flag** - `isProtected` for important records
4. **Create proper indexes** - For frequently queried fields
5. **Use UUIDs** - For primary keys (`@default(uuid())`)

### Server Action Rules

1. **Always filter trashed items** - `isTrashed: false` in queries
2. **Use revalidatePath** - After create/update/delete operations
3. **Handle file uploads gracefully** - Continue if upload fails
4. **Validate input** - Use Zod schemas for validation
5. **Log errors** - But don't expose internal errors to users

### React Component Rules

1. **Use manual pagination/sorting** - For server-side data
2. **Handle loading states** - Show loading indicators
3. **Implement optimistic updates** - For better UX
4. **Use proper error boundaries** - Catch and display errors
5. **Implement search debouncing** - For better performance

### Form Rules

1. **Use React Hook Form** - With Zod validation
2. **Use reusable form components** - `FormTextInput`, `FormPhoneInput`, `FormDateInput`, `FormToggleGroup`, `FormSelect`, `LoadingButton`
3. **Handle file uploads** - With proper preview
4. **Implement read-only mode** - For viewing records
5. **Validate on submit** - Not on every change
6. **Show validation errors** - In user-friendly format
7. **Provide loading feedback** - Use `LoadingButton` for submit actions
8. **Disable form during submission** - Prevent multiple submissions
9. **Use consistent styling** - All form components follow the same design patterns
10. **Centralize form exports** - Use `form-components.ts` for clean imports

## 9. Migration Template

### Prisma Migration

```sql
-- Create entity table
CREATE TABLE "EntityName" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "isTrashed" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" TEXT,
  "isProtected" BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT "EntityName_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX "EntityName_name_idx" ON "EntityName"("name");
CREATE INDEX "EntityName_status_idx" ON "EntityName"("status");
CREATE INDEX "EntityName_createdByUserId_idx" ON "EntityName"("createdByUserId");
```

## 10. Testing Checklist

### Database Testing

- [ ] Soft delete works correctly
- [ ] Protected records cannot be deleted
- [ ] Search functionality works across all fields
- [ ] Pagination returns correct results
- [ ] Sorting works on all sortable columns

### UI Testing

- [ ] Create new entity works
- [ ] Edit existing entity works
- [ ] Delete entity shows confirmation
- [ ] Search filters results correctly
- [ ] Pagination navigation works
- [ ] Sorting changes table order
- [ ] File upload works (if applicable)
- [ ] Form validation shows errors
- [ ] Read-only mode works
- [ ] Loading states work correctly
- [ ] Reusable form components render properly

### Error Handling

- [ ] Network errors are handled gracefully
- [ ] Validation errors are displayed
- [ ] File upload failures don't break form
- [ ] Server errors show user-friendly messages

## 11. Performance Considerations

### Database Optimization

- Use proper indexes for frequently queried fields
- Implement pagination to limit result sets
- Use `select` to only fetch needed fields
- Consider database connection pooling

### Frontend Optimization

- Implement search debouncing (300ms delay)
- Use React.memo for expensive components
- Implement virtual scrolling for large datasets
- Cache API responses with React Query

### File Upload Optimization

- Compress images before upload
- Set reasonable file size limits
- Use CDN for file delivery
- Implement upload progress indicators

## 12. Security Considerations

### Input Validation

- Always validate input on both client and server
- Use Zod schemas for type-safe validation
- Sanitize user input before database operations
- Implement proper error handling without exposing internals

### Authorization

- Check user permissions before CRUD operations
- Validate user ownership for sensitive operations
- Implement role-based access control
- Log all sensitive operations

### File Upload Security

- Validate file types and sizes
- Scan uploaded files for malware
- Store files in secure, isolated locations
- Implement proper file access controls

## 13. Common Patterns

### Search Pattern

```typescript
// Multi-field search with case insensitivity
const where: Prisma.EntityWhereInput = {
  isTrashed: false,
  ...(query && {
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
    ],
  }),
};
```

### Status Badge Pattern

```typescript
// Dynamic status badges with colors
const getStatusBadge = (status: string) => {
  const config = {
    active: { bg: 'bg-green-100', border: 'border-green-200', text: 'text-green-800' },
    inactive: { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-800' },
    pending: { bg: 'bg-yellow-100', border: 'border-yellow-200', text: 'text-yellow-800' },
  };

  const style = config[status] || config.inactive;

  return (
    <div className={`px-2 py-1 rounded-full border text-sm font-medium ${style.bg} ${style.border} ${style.text}`}>
      {status}
    </div>
  );
};
```

### Action Menu Pattern

```typescript
// Consistent action dropdown
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button className="h-7 w-7" mode="icon" variant="ghost">
      <MoreVertical />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent side="bottom" align="start">
    <DropdownMenuItem onClick={() => handleView(row.original)}>
      <Eye className="mr-2 h-4 w-4" />
      View
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => handleEdit(row.original)}>
      <Pencil className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      variant="destructive"
      onClick={() => setDeletingItem(row.original)}
    >
      <Trash className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Form Component Pattern

```typescript
// Consistent form field structure
<FormField label="Field Label">
  <FormTextInput
    register={register('fieldName')}
    error={errors.fieldName}
    placeholder="Enter field value"
    disabled={isSubmitting || isReadOnly}
  />
</FormField>

// Loading button pattern
<LoadingButton
  size="lg"
  type="submit"
  isLoading={isSubmitting}
  loadingText="Guardando..."
  className="h-10 px-4 text-sm font-medium bg-[#1379F0] text-white"
>
  Guardar
</LoadingButton>
```

This pattern provides a complete, scalable foundation for any CRUD entity management system with consistent UX, proper error handling, and database best practices.
