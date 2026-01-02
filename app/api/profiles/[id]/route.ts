import prisma from '@/lib/prisma';

import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
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
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req);

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  } 
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(req);

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      );
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
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  } 
}
