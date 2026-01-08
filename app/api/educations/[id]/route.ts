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
      return errorResponse('Education ID is required', 400);
    }

    const education = await prisma.education.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!education) {
      return errorResponse('Education not found', 404);
    }

    return successResponse(education, 'Education retrieved successfully');
  } catch (error) {
    console.error('Error fetching education:', error);
    return errorResponse('Failed to fetch education', 500, error);
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
      return errorResponse('Education ID is required', 400);
    }

    const body = await req.json();
    const { school, major, startYear, endYear, schoolLogo, icon, categoryId } = body;

    if (!school || !major || !startYear || !endYear || !categoryId) {
      return errorResponse('School, major, startYear, endYear, and categoryId are required', 400);
    }

    if (startYear > endYear) {
      return errorResponse('Start year cannot be greater than end year', 400);
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

    return successResponse(education, 'Education updated successfully');
  } catch (error) {
    console.error('Error updating education:', error);
    return errorResponse('Failed to update education', 500, error);
  }
}

export async function DELETE(
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
      return errorResponse('Education ID is required', 400);
    }

    const education = await prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      return errorResponse('Education not found', 404);
    }

    // Delete the education
    await prisma.education.delete({
      where: { id },
    });

    // Delete image files if exist
    await Promise.all([
      deleteImageFile(education.icon),
      deleteImageFile(education.schoolLogo)
    ]);

    return successResponse(null, 'Education deleted successfully');
  } catch (error) {
    console.error('Error deleting education:', error);
    return errorResponse('Failed to delete education', 500, error);
  }
}
