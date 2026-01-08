import prisma from '@/lib/prisma';

import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-response';
import { cookies } from 'next/headers';

async function authenticateRequest(
  req: Request
): Promise<{ username: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return errorResponse('Profile ID is required', 400);
    }

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        category: true,
        items: {
          include: {
            children: true,
          },
        },
      },
    });

    if (!profile) {
      return errorResponse('Profile not found', 404);
    }

    return successResponse(profile, 'Profile retrieved successfully');
  } catch (error) {
    console.error('Error fetching profile:', error);
    return errorResponse('Failed to fetch profile', 500, error as Error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req);

    if (!auth) {
      return errorResponse('Unauthorized', 401);
    }

    const body = (await req.json()) as {
      name: string;
      fullName: string;
      jenisKelamin: 'PRIA' | 'WANITA';
      role: string;
      quote: string;
      photoURL?: string;
      birthDate?: string;
      birthPlace?: string;
      experienceYears?: number;
      description?: string;
      address?: string;
      lat?: number;
      lng?: number;
      mapURL?: string;
      categoryId: string;
    };

    const profile = await prisma.profile.create({
      data: {
        name: body.name,
        fullName: body.fullName,
        jenisKelamin: body.jenisKelamin,
        role: body.role,
        quote: body.quote,
        photoURL: body.photoURL,
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
        birthPlace: body.birthPlace,
        experienceYears: body.experienceYears,
        description: body.description,
        address: body.address,
        lat: body.lat,
        lng: body.lng,
        mapURL: body.mapURL,
        categoryId: body.categoryId,
      },
      include: {
        category: true,
      },
    });

    return successResponse(profile, 'Profile created successfully', 201);
  } catch (error) {
    console.error('Error creating profile:', error);
    return errorResponse('Failed to create profile', 500, error as Error);
  } 
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(req);

    if (!auth) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await context.params;

    if (!id) {
      return errorResponse('Profile ID is required', 400);
    }

    const body = (await req.json()) as {
      name?: string;
      fullName?: string;
      jenisKelamin?: 'PRIA' | 'WANITA';
      role?: string;
      quote?: string;
      photoURL?: string;
      birthDate?: string;
      birthPlace?: string;
      experienceYears?: number;
      description?: string;
      address?: string;
      lat?: number;
      lng?: number;
      mapURL?: string;
      categoryId?: string;
      preferredLanguages?: string[];
    };

    const profile = await prisma.profile.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.fullName !== undefined && { fullName: body.fullName }),
        ...(body.jenisKelamin !== undefined && { jenisKelamin: body.jenisKelamin }),
        ...(body.role !== undefined && { role: body.role }),
        ...(body.quote !== undefined && { quote: body.quote }),
        ...(body.photoURL !== undefined && { photoURL: body.photoURL }),
        ...(body.birthDate !== undefined && { birthDate: body.birthDate ? new Date(body.birthDate) : null }),
        ...(body.birthPlace !== undefined && { birthPlace: body.birthPlace }),
        ...(body.experienceYears !== undefined && { experienceYears: body.experienceYears }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.lat !== undefined && { lat: body.lat }),
        ...(body.lng !== undefined && { lng: body.lng }),
        ...(body.mapURL !== undefined && { mapURL: body.mapURL }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.preferredLanguages !== undefined && { preferredLanguages: body.preferredLanguages }),
      },
      include: {
        category: true,
      },
    });

    return successResponse(profile, 'Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    return errorResponse('Failed to update profile', 500, error as Error);
  } 
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(req);

    if (!auth) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await context.params;

    if (!id) {
      return errorResponse('Profile ID is required', 400);
    }

    const body = (await req.json()) as {
      preferredLanguages?: string[];
    };

    if (!body.preferredLanguages) {
      return errorResponse('preferredLanguages is required', 400);
    }

    const profile = await prisma.profile.update({
      where: { id },
      data: {
        preferredLanguages: body.preferredLanguages,
      },
      select: {
        id: true,
        preferredLanguages: true,
      },
    });

    return successResponse(profile, 'Language preferences updated successfully');
  } catch (error) {
    console.error('Error updating language preferences:', error);
    return errorResponse('Failed to update language preferences', 500, error as Error);
  }
}
