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
    const educations = await prisma.education.findMany({
      include: {
        category: true,
      },
    });

    return NextResponse.json(educations);
  } catch (error) {
    console.error('Error fetching educations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch educations' },
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

    const body = await req.json();
    const { school, major, startYear, endYear, schoolLogo, icon, categoryId } = body;

    if (!school || !major || !startYear || !endYear || !categoryId) {
      return NextResponse.json(
        { error: 'School, major, startYear, endYear, and categoryId are required' },
        { status: 400 }
      );
    }

    if (startYear > endYear) {
      return NextResponse.json(
        { error: 'Start year cannot be greater than end year' },
        { status: 400 }
      );
    }

    const education = await prisma.education.create({
      data: {
        school,
        major,
        startYear: Number(startYear),
        endYear: Number(endYear),
        schoolLogo: schoolLogo || null,
        icon: icon || null,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json(
      { error: 'Failed to create education' },
      { status: 500 }
    );
  }
}
