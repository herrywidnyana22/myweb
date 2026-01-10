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

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        category: true,
        items: {
          include: {
            children: true,
          },
        },
      },
    });

    return NextResponse.json({
      code: 200,
      status: 'ok',
      msg: 'Profiles fetched successfully',
      data: profiles
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { 
        code: 500,
        status: 'error',
        msg: 'Failed to fetch profiles',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      },
      { status: 500 }
    );
  } 
}

export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req);

    if (!auth) {
      return NextResponse.json(
        { 
          code: 401,
          status: 'error',
          msg: 'Unauthorized',
          data: null
        },
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
      cvURL?: string;
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
        cvURL: body.cvURL,
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

    // If CV is attached, create ProfileItem for resume
    if (body.cvURL) {
      await prisma.profileItem.create({
        data: {
          profileId: profile.id,
          name: { en: "Resume", id: "Resume", ja: "履歴書", zh: "简历" },
          tooltipText: { en: "View Resume", id: "Lihat Resume", ja: "履歴書を見る", zh: "查看简历" },
          kind: "FILE",
          fileType: "PDF",
          href: body.cvURL,
        },
      });
    }

    return NextResponse.json({
      code: 201,
      status: 'ok',
      msg: 'Profile created successfully',
      data: profile
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { 
        code: 500,
        status: 'error',
        msg: 'Failed to create profile',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      },
      { status: 500 }
    );
  } 
}
