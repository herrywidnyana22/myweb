import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-response';
import { cookies } from 'next/headers';
import { deleteImageFile } from '@/lib/file-utils';

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
      return errorResponse('Experience ID is required', 400);
    }

    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!experience) {
      return errorResponse('Experience not found', 404);
    }

    return successResponse(experience, 'Experience retrieved successfully');
  } catch (error) {
    console.error('Error fetching experience:', error);
    return errorResponse('Failed to fetch experience', 500, error as Error);
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
      return errorResponse('Experience ID is required', 400);
    }

    const body = await req.json();
    const {
      company,
      role,
      location,
      start,
      end,
      jobdesk,
      description,
      icon,
      categoryId,
    } = body;

    if (!company || !role || !location || !start || !end || !categoryId) {
      return errorResponse(
        'Company, role, location, start, end, and categoryId are required',
        400
      );
    }

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        company,
        role,
        location,
        start,
        end,
        ...(jobdesk !== undefined && { jobdesk }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return successResponse(experience, 'Experience updated successfully');
  } catch (error) {
    console.error('Error updating experience:', error);
    return errorResponse('Failed to update experience', 500, error as Error);
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
      return errorResponse('Experience ID is required', 400);
    }

    const experience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      return errorResponse('Experience not found', 404);
    }

    // Delete the experience
    await prisma.experience.delete({
      where: { id },
    });

    // Delete the icon file if exists
    if (experience.icon) {
      await deleteImageFile(experience.icon);
    }

    return successResponse(null, 'Experience deleted successfully');
  } catch (error) {
    console.error('Error deleting experience:', error);
    return errorResponse('Failed to delete experience', 500, error as Error);
  }
}
