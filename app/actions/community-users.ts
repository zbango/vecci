'use server';

import { CommunityUser, Prisma } from '@prisma/client';
import { deleteImage, uploadImage } from '@/lib/supabase-storage';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Use Prisma's auto-generated type
export type ICommunityUser = CommunityUser;

export interface SearchParams {
  page?: number;
  limit?: number;
  query?: string;
  sort?: string;
  dir?: 'asc' | 'desc';
}

export async function getCommunityUsers(params: SearchParams = {}) {
  const {
    page = 1,
    limit = 10,
    query = '',
    sort = 'firstName',
    dir = 'asc',
  } = params;

  try {
    // Build where clause for search
    const where: Prisma.CommunityUserWhereInput = {
      isTrashed: false, // Only show non-deleted users
      ...(query && {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { firstLastName: { contains: query, mode: 'insensitive' } },
          { identificationNumber: { contains: query } },
          { mobilePhone: { contains: query } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      }),
    };

    // Build order by clause
    let orderBy:
      | Prisma.CommunityUserOrderByWithRelationInput
      | Prisma.CommunityUserOrderByWithRelationInput[];
    if (sort === 'firstName') {
      // For computed name field, sort by firstName then firstLastName
      orderBy = [
        { firstName: dir as Prisma.SortOrder },
        { firstLastName: dir as Prisma.SortOrder },
      ];
    } else if (sort === 'contact') {
      // For contact, sort by mobilePhone
      orderBy = { mobilePhone: dir as Prisma.SortOrder };
    } else if (sort === 'resident') {
      orderBy = { residentRole: dir as Prisma.SortOrder };
    } else if (sort === 'admin') {
      orderBy = { adminRole: dir as Prisma.SortOrder };
    } else {
      // For direct field matches
      orderBy = {
        [sort as keyof Prisma.CommunityUserOrderByWithRelationInput]:
          dir as Prisma.SortOrder,
      };
    }

    // Get total count
    const total = await prisma.communityUser.count({ where });

    // Get paginated users
    const users = await prisma.communityUser.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        isPublic: true,
        email: true,
        avatar: true,
        firstName: true,
        secondName: true,
        firstLastName: true,
        secondLastName: true,
        nationality: true,
        identificationType: true,
        identificationNumber: true,
        birthDate: true,
        mobilePhone: true,
        homePhone: true,
        residentRole: true,
        adminRole: true,
        createdAt: true,
        updatedAt: true,
        isTrashed: true,
        createdByUserId: true,
        isProtected: true,
      },
    });

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error fetching community users:', error);
    throw new Error('Failed to fetch community users');
  }
}

export async function createCommunityUser(formData: FormData) {
  try {
    // Handle avatar upload if provided
    let avatarUrl = ''; // Default avatar
    const avatarFile = formData.get('avatarFile') as File | null;

    if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
      try {
        const result = await uploadImage({
          file: avatarFile,
          bucket: 'vecci-images',
          folder: 'community-users',
        });
        avatarUrl = result.imageUrl;
      } catch (uploadError) {
        console.error('Failed to upload avatar:', uploadError);
        // Continue with default avatar if upload fails
      }
    } else {
      console.log('no avatar file');
    }

    const newUser = await prisma.communityUser.create({
      data: {
        email: formData.get('email') as string,
        isPublic: false,
        firstName: formData.get('firstName') as string,
        secondName: (formData.get('secondName') as string) || null,
        firstLastName: formData.get('firstLastName') as string,
        secondLastName: (formData.get('secondLastName') as string) || null,
        nationality: (formData.get('nationality') as string) || 'Ecuador',
        identificationType:
          (formData.get('identificationType') as string) || 'Cédula',
        identificationNumber: formData.get('identificationNumber') as string,
        birthDate: new Date(formData.get('birthDate') as string),
        mobilePhone: formData.get('mobilePhone') as string,
        homePhone: (formData.get('homePhone') as string) || null,
        residentRole: (formData.get('residentRole') as string) || 'Propietario',
        adminRole: (formData.get('adminRole') as string) || 'Usuario',
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });

    revalidatePath('/community/users');
    return newUser;
  } catch (error) {
    console.error('Error creating community user:', error);
    throw new Error('Failed to create community user');
  }
}

export async function updateCommunityUser(id: string, formData: FormData) {
  try {
    // Get current user to check existing avatar
    const currentUser = await prisma.communityUser.findUnique({
      where: { id },
      select: { avatar: true },
    });

    // Handle avatar upload if provided
    let avatarUrl = currentUser?.avatar || '';
    const avatarFile = formData.get('avatarFile') as File | null;

    if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
      try {
        // Delete old avatar if it exists and is not the default
        if (
          currentUser?.avatar &&
          !currentUser.avatar.includes('/media/avatars/300-')
        ) {
          try {
            await deleteImage(currentUser.avatar);
          } catch (deleteError) {
            console.error('Failed to delete old avatar:', deleteError);
          }
        }

        // Upload new avatar
        const result = await uploadImage({
          file: avatarFile,
          bucket: 'vecci-images',
          folder: 'community-users',
        });
        avatarUrl = result.imageUrl;
      } catch (uploadError) {
        console.error('Failed to upload avatar:', uploadError);
        // Keep existing avatar if upload fails
      }
    }

    const updatedUser = await prisma.communityUser.update({
      where: { id },
      data: {
        email: formData.get('email') as string,
        firstName: formData.get('firstName') as string,
        secondName: (formData.get('secondName') as string) || null,
        firstLastName: formData.get('firstLastName') as string,
        secondLastName: (formData.get('secondLastName') as string) || null,
        nationality: (formData.get('nationality') as string) || 'Ecuador',
        identificationType:
          (formData.get('identificationType') as string) || 'Cédula',
        identificationNumber: formData.get('identificationNumber') as string,
        birthDate: new Date(formData.get('birthDate') as string),
        mobilePhone: formData.get('mobilePhone') as string,
        homePhone: (formData.get('homePhone') as string) || null,
        residentRole: (formData.get('residentRole') as string) || 'Propietario',
        adminRole: (formData.get('adminRole') as string) || 'Usuario',
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });

    revalidatePath('/community/users');
    return updatedUser;
  } catch (error) {
    console.error('Error updating community user:', error);
    throw new Error('Failed to update community user');
  }
}

export async function deleteCommunityUser(id: string) {
  try {
    await prisma.communityUser.update({
      where: { id },
      data: { isTrashed: true }, // Soft delete
    });

    revalidatePath('/community/users');
    return { success: true };
  } catch (error) {
    console.error('Error deleting community user:', error);
    throw new Error('Failed to delete community user');
  }
}
