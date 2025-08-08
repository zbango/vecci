'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FieldError } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormSelect } from './form-select';
import { FormTextInput } from './form-text-input';

interface Assignment {
  id?: string;
  communityUserId: string;
  position: string;
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

interface FormDynamicAssignmentsProps {
  assignments: Assignment[];
  onAssignmentsChange: (assignments: Assignment[]) => void;
  communityUsers: CommunityUser[];
  error?: FieldError;
  disabled?: boolean;
  className?: string;
}

export function FormDynamicAssignments({
  assignments,
  onAssignmentsChange,
  communityUsers,
  error,
  disabled = false,
  className = '',
}: FormDynamicAssignmentsProps) {
  const addAssignment = () => {
    const newAssignment: Assignment = {
      communityUserId: '',
      position: '',
    };
    onAssignmentsChange([...assignments, newAssignment]);
  };

  const removeAssignment = (index: number) => {
    const newAssignments = assignments.filter((_, i) => i !== index);
    onAssignmentsChange(newAssignments);
  };

  const updateAssignment = (
    index: number,
    field: keyof Assignment,
    value: string,
  ) => {
    const newAssignments = [...assignments];
    newAssignments[index] = {
      ...newAssignments[index],
      [field]: value,
    };
    onAssignmentsChange(newAssignments);
  };

  const getCommunityUserOptions = () => {
    return communityUsers.map((user) => ({
      value: user.id,
      label:
        `${user.firstName} ${user.secondName || ''} ${user.firstLastName} ${user.secondLastName || ''}`.trim(),
    }));
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {assignments.map((assignment, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50"
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario
                </label>
                <FormSelect
                  value={assignment.communityUserId}
                  onValueChange={(value) =>
                    updateAssignment(index, 'communityUserId', value)
                  }
                  options={getCommunityUserOptions()}
                  placeholder="Selecciona un usuario"
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo
                </label>
                <FormTextInput
                  register={{
                    name: `assignments.${index}.position`,
                    onChange: (e) =>
                      updateAssignment(index, 'position', e.target.value),
                    value: assignment.position,
                  }}
                  placeholder="Ingresa el cargo"
                  disabled={disabled}
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeAssignment(index)}
              disabled={disabled}
              className="mt-6"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addAssignment}
          disabled={disabled}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Usuario
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-1">{error.message}</div>
      )}
    </div>
  );
}
