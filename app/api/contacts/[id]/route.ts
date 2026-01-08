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
      return errorResponse('Contact ID is required', 400);
    }

    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!contact) {
      return errorResponse('Contact not found', 404);
    }

    return successResponse(contact, 'Contact retrieved successfully');
  } catch (error) {
    console.error('Error fetching contact:', error);
    return errorResponse('Failed to fetch contact', 500, error);
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
      return errorResponse('Contact ID is required', 400);
    }

    const body = await req.json();
    const { title, description, tooltipText, icon, bgColor, contactURL, categoryId } = body;

    if (!title || !description || !categoryId) {
      return errorResponse('Title, Description, and Category ID are required', 400);
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        title,
        description,
        ...(tooltipText !== undefined && { tooltipText }),
        ...(icon !== undefined && { icon }),
        ...(bgColor !== undefined && { bgColor }),
        ...(contactURL !== undefined && { contactURL }),
        ...(categoryId !== undefined && { categoryId }),
      },
      include: {
        category: true,
      },
    });

    return successResponse(contact, 'Contact updated successfully');
  } catch (error) {
    console.error('Error updating contact:', error);
    return errorResponse('Failed to update contact', 500, error);
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
      return errorResponse('Contact ID is required', 400);
    }

    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return errorResponse('Contact not found', 404);
    }

    // Delete the contact
    await prisma.contact.delete({
      where: { id },
    });

    // Delete the icon file if exists
    if (contact.icon) {
      await deleteImageFile(contact.icon);
    }

    return successResponse(null, 'Contact deleted successfully');
  } catch (error) {
    console.error('Error deleting contact:', error);
    return errorResponse('Failed to delete contact', 500, error);
  }
}
