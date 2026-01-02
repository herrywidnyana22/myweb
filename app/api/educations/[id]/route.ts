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
        { error: 'Education ID is required' },
        { status: 400 }
      );
    }

    const education = await prisma.education.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!education) {
      return NextResponse.json(
        { error: 'Education not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(education);
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json(
      { error: 'Failed to fetch education' },
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
        { error: 'Education ID is required' },
        { status: 400 }
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

    const education = await prisma.education.update({
      where: { id },
      data: {
        school,
        major,
        startYear: Number(startYear),
        endYear: Number(endYear),
        ...(schoolLogo !== undefined && { schoolLogo }),
        ...(icon !== undefined && { icon }),
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error('Error updating education:', error);
    return NextResponse.json(
      { error: 'Failed to update education' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
        { error: 'Education ID is required' },
        { status: 400 }
      );
    }

    const education = await prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      return NextResponse.json(
        { error: 'Education not found' },
        { status: 404 }
      );
    }

    await prisma.education.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json(
      { error: 'Failed to delete education' },
      { status: 500 }
    );
  }
}
