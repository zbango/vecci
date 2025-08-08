'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// Type exports
export type IHeadquarters = Prisma.HeadquartersGetPayload<{
  include: {
    userAssignments: {
      include: {
        communityUser: true;
      };
    };
  };
}>;

export type IHeadquartersUserAssignment =
  Prisma.HeadquartersUserAssignmentGetPayload<{
    include: {
      communityUser: true;
    };
  }>;

// Search interface
export interface SearchParams {
  page?: number;
  limit?: number;
  query?: string;
  sort?: string;
  dir?: 'asc' | 'desc';
}

// READ - with pagination, sorting, filtering
export async function getHeadquarters(params: SearchParams = {}) {
  const {
    page = 1,
    limit = 10,
    query = '',
    sort = 'type',
    dir = 'asc',
  } = params;

  const where: Prisma.HeadquartersWhereInput = {
    isTrashed: false, // Always filter out trashed items
    ...(query && {
      OR: [
        { type: { contains: query, mode: 'insensitive' } },
        { identification: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { mobilePhone: { contains: query, mode: 'insensitive' } },
      ],
    }),
  };

  const total = await prisma.headquarters.count({ where });
  const headquarters = await prisma.headquarters.findMany({
    where,
    include: {
      userAssignments: {
        where: { isTrashed: false },
        include: {
          communityUser: true,
        },
      },
    },
    orderBy: { [sort]: dir as Prisma.SortOrder },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    headquarters,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// Get single headquarters with assignments
export async function getHeadquartersById(id: string) {
  return await prisma.headquarters.findUnique({
    where: { id, isTrashed: false },
    include: {
      userAssignments: {
        where: { isTrashed: false },
        include: {
          communityUser: true,
        },
      },
    },
  });
}

// Get active community users for assignment selector
export async function getActiveCommunityUsers() {
  return await prisma.communityUser.findMany({
    where: {
      isTrashed: false,
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
    orderBy: {
      firstName: 'asc',
    },
  });
}

// CREATE
export async function createHeadquarters(formData: FormData) {
  try {
    const headquartersData = {
      avatar: (formData.get('avatar') as string) || null,
      type: formData.get('type') as string,
      identification: formData.get('identification') as string,
      address: formData.get('address') as string,
      reference: (formData.get('reference') as string) || null,
      mobilePhone: formData.get('mobilePhone') as string,
      homePhone: (formData.get('homePhone') as string) || null,
      email: formData.get('email') as string,
    };

    // Parse assignments from form data
    const assignmentsData = JSON.parse(
      (formData.get('assignments') as string) || '[]',
    );

    const headquarters = await prisma.headquarters.create({
      data: {
        ...headquartersData,
        userAssignments: {
          create: assignmentsData.map((assignment: any) => ({
            communityUserId: assignment.communityUserId,
            position: assignment.position,
          })),
        },
      },
      include: {
        userAssignments: {
          include: {
            communityUser: true,
          },
        },
      },
    });

    revalidatePath('/community/headquarters');
    return headquarters;
  } catch (error) {
    console.error('Error creating headquarters:', error);
    throw new Error('Failed to create headquarters');
  }
}

// UPDATE
export async function updateHeadquarters(id: string, formData: FormData) {
  try {
    const headquartersData = {
      avatar: (formData.get('avatar') as string) || null,
      type: formData.get('type') as string,
      identification: formData.get('identification') as string,
      address: formData.get('address') as string,
      reference: (formData.get('reference') as string) || null,
      mobilePhone: formData.get('mobilePhone') as string,
      homePhone: (formData.get('homePhone') as string) || null,
      email: formData.get('email') as string,
    };

    // Parse assignments from form data
    const assignmentsData = JSON.parse(
      (formData.get('assignments') as string) || '[]',
    );

    // Delete existing assignments
    await prisma.headquartersUserAssignment.deleteMany({
      where: { headquartersId: id },
    });

    const headquarters = await prisma.headquarters.update({
      where: { id },
      data: {
        ...headquartersData,
        userAssignments: {
          create: assignmentsData.map((assignment: any) => ({
            communityUserId: assignment.communityUserId,
            position: assignment.position,
          })),
        },
      },
      include: {
        userAssignments: {
          include: {
            communityUser: true,
          },
        },
      },
    });

    revalidatePath('/community/headquarters');
    return headquarters;
  } catch (error) {
    console.error('Error updating headquarters:', error);
    throw new Error('Failed to update headquarters');
  }
}

// DELETE (soft delete)
export async function deleteHeadquarters(id: string) {
  await prisma.headquarters.update({
    where: { id },
    data: { isTrashed: true },
  });

  revalidatePath('/community/headquarters');
  return { success: true };
}
