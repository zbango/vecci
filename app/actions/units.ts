'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type IUnit = Prisma.UnitGetPayload<{
  include: {
    userAssignments: { include: { communityUser: true } };
    additionalSpaces: {
      include: {
        userAssignments: { include: { communityUser: true } };
      };
    };
    headquarters: true;
  };
}>;

export interface SearchParams {
  page?: number;
  limit?: number;
  query?: string;
  sort?: string;
  dir?: 'asc' | 'desc';
}

export async function getUnits(params: SearchParams = {}) {
  const {
    page = 1,
    limit = 10,
    query = '',
    sort = 'createdAt',
    dir = 'desc',
  } = params;

  const where: Prisma.UnitWhereInput = {
    isTrashed: false,
    ...(query && {
      OR: [
        { type: { contains: query, mode: 'insensitive' } },
        { identification: { contains: query, mode: 'insensitive' } },
        { reference: { contains: query, mode: 'insensitive' } },
        {
          headquarters: {
            identification: { contains: query, mode: 'insensitive' },
          },
        },
      ],
    }),
  };

  const total = await prisma.unit.count({ where });
  const units = await prisma.unit.findMany({
    where,
    include: {
      headquarters: true,
    },
    orderBy: { [sort]: dir as Prisma.SortOrder },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    units,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export interface UnitCreatePayload {
  avatar?: string | null;
  type: string;
  identification: string;
  area: number;
  reference?: string | null;
  headquartersId: string;
  // top-level role assignments for unit
  ownerId?: string | null;
  tenantId?: string | null;
  // additional spaces
  additionalSpaces?: Array<{
    type: string;
    identification: string;
    area: number;
    reference?: string | null;
    ownerId?: string | null;
    tenantId?: string | null;
  }>;
}

export async function getActiveHeadquartersForSelect() {
  return prisma.headquarters.findMany({
    where: { isTrashed: false },
    select: { id: true, type: true, identification: true },
    orderBy: { identification: 'asc' },
  });
}

export async function getActiveCommunityUsersByResidentRole(
  role: 'Propietario' | 'Inquilino',
) {
  return prisma.communityUser.findMany({
    where: {
      isTrashed: false,
      residentRole: role,
    },
    select: {
      id: true,
      firstName: true,
      secondName: true,
      firstLastName: true,
      secondLastName: true,
      email: true,
      avatar: true,
    },
    orderBy: { firstName: 'asc' },
  });
}

export async function createUnit(formData: FormData) {
  try {
    const unitData: UnitCreatePayload = JSON.parse(
      String(formData.get('unit')),
    );

    const created = await prisma.$transaction(async (tx) => {
      const unit = await tx.unit.create({
        data: {
          avatar: unitData.avatar ?? null,
          type: unitData.type,
          identification: unitData.identification,
          area: unitData.area,
          reference: unitData.reference ?? null,
          headquartersId: unitData.headquartersId,
        },
      });

      // top-level owner/tenant assignments
      const assignmentCreates: Prisma.UnitUserAssignmentCreateManyInput[] = [];
      if (unitData.ownerId) {
        assignmentCreates.push({
          unitId: unit.id,
          communityUserId: unitData.ownerId,
          role: 'Propietario',
        });
      }
      if (unitData.tenantId) {
        assignmentCreates.push({
          unitId: unit.id,
          communityUserId: unitData.tenantId,
          role: 'Inquilino',
        });
      }
      if (assignmentCreates.length) {
        await tx.unitUserAssignment.createMany({ data: assignmentCreates });
      }

      // additional spaces
      if (unitData.additionalSpaces?.length) {
        for (const space of unitData.additionalSpaces) {
          const createdSpace = await tx.unitAdditionalSpace.create({
            data: {
              unitId: unit.id,
              type: space.type,
              identification: space.identification,
              area: space.area,
              reference: space.reference ?? null,
            },
          });
          const spaceAssignments: Prisma.UnitAdditionalSpaceUserAssignmentCreateManyInput[] =
            [];
          if (space.ownerId) {
            spaceAssignments.push({
              additionalSpaceId: createdSpace.id,
              communityUserId: space.ownerId,
              role: 'Propietario',
            });
          }
          if (space.tenantId) {
            spaceAssignments.push({
              additionalSpaceId: createdSpace.id,
              communityUserId: space.tenantId,
              role: 'Inquilino',
            });
          }
          if (spaceAssignments.length) {
            await tx.unitAdditionalSpaceUserAssignment.createMany({
              data: spaceAssignments,
            });
          }
        }
      }

      return unit;
    });

    revalidatePath('/community/units');
    return created;
  } catch (error) {
    console.error('Error creating unit:', error);
    throw new Error('Failed to create unit');
  }
}
