'use client';

import React, { useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  ArrayPath,
  Control,
  FieldArray,
  FieldArrayWithId,
  FieldValues,
  useFieldArray,
  UseFieldArrayUpdate,
} from 'react-hook-form';
import { Button } from '@/components/ui/button';

type RenderItemArgs<
  TFieldValues extends FieldValues,
  TName extends ArrayPath<TFieldValues>,
> = {
  index: number;
  field: FieldArrayWithId<TFieldValues, TName, 'id'>;
  remove: (index: number) => void;
  update: UseFieldArrayUpdate<TFieldValues, TName>;
  disabled?: boolean;
};

interface FormDynamicAssignmentsProps<
  TFieldValues extends FieldValues,
  TName extends ArrayPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  defaultItem: FieldArray<TFieldValues, TName>;
  renderItem: (args: RenderItemArgs<TFieldValues, TName>) => React.ReactNode;
  disabled?: boolean;
  className?: string;
  showAddButton?: boolean;
  addLabel?: string;
  minItems?: number; // default 1
  onRegisterAdd?: (add: () => void) => void; // allows external toolbar button
}

export function FormDynamicAssignments<
  TFieldValues extends FieldValues,
  TName extends ArrayPath<TFieldValues>,
>({
  control,
  name,
  defaultItem,
  renderItem,
  disabled = false,
  className = '',
  showAddButton = true,
  addLabel = 'Agregar',
  minItems = 1,
  onRegisterAdd,
}: FormDynamicAssignmentsProps<TFieldValues, TName>) {
  const { fields, append, remove, update } = useFieldArray({ control, name });

  // ensure there is at least minItems
  useEffect(() => {
    if (fields.length === 0 && minItems > 0) {
      append(defaultItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length, minItems]);

  // expose an external add function for toolbar buttons (register once)
  const defaultRef = useRef(defaultItem);
  useEffect(() => {
    defaultRef.current = defaultItem;
  }, [defaultItem]);
  const registered = useRef(false);
  useEffect(() => {
    if (onRegisterAdd && !registered.current) {
      onRegisterAdd(() => append(defaultRef.current));
      registered.current = true;
    }
  }, [append, onRegisterAdd]);

  return (
    <div className={className}>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="py-4 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4 border rounded-lg"
          >
            <div className="flex flex-col gap-2">
              {renderItem({
                index,
                field,
                remove: () => remove(index),
                update,
                disabled,
              })}
            </div>

            <div className="flex items-center md:justify-end mr-9">
              <Button
                type="button"
                variant="destructive"
                appearance="ghost"
                size="sm"
                onClick={() => remove(index)}
                disabled={disabled}
                className="self-center"
              >
                Eliminar
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {showAddButton && (
          <Button
            type="button"
            variant="outline"
            onClick={() => append(defaultItem)}
            disabled={disabled}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
