import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
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
      return errorResponse('Profile Item ID is required', 400);
    }

    const body = await req.json();
    const {
      name,
      kind,
      fileType,
      parentId,
      icon,
      imageUrl,
      href,
      subtitle,
      description,
      tooltipText,
      extra,
    } = body;

    if (!name || !kind) {
      return errorResponse('Name and kind are required', 400);
    }

    const profileItem = await prisma.profileItem.update({
      where: { id },
      data: {
        name,
        kind,
        fileType: fileType || null,
        parentId: parentId || null,
        icon: icon || null,
        imageUrl: imageUrl || null,
        href: href || null,
        subtitle: subtitle || null,
        description: description || '',
        tooltipText: tooltipText || null,
        extra: extra || null,
      },
      include: {
        children: true,
      },
    });

    return successResponse(profileItem, 'Profile item updated successfully');
  } catch (error) {
    console.error('Error updating profile item:', error);
    return errorResponse('Failed to update profile item', 500, error as Error);
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
      return errorResponse('Profile Item ID is required', 400);
    }

    // Delete recursively (children will be deleted via cascade or manually)
    const deleteRecursive = async (itemId: string) => {
      // Get item with its data before deleting
      const item = await prisma.profileItem.findUnique({
        where: { id: itemId },
      });

      const children = await prisma.profileItem.findMany({
        where: { parentId: itemId },
      });

      for (const child of children) {
        await deleteRecursive(child.id);
      }

      await prisma.profileItem.delete({
        where: { id: itemId },
      });

      // Delete image files if exist
      if (item) {
        await Promise.all([
          deleteImageFile(item.icon),
          deleteImageFile(item.imageUrl)
        ]);
      }
    };

    await deleteRecursive(id);

    return successResponse(null, 'Profile item deleted successfully');
  } catch (error) {
    console.error('Error deleting profile item:', error);
    return errorResponse('Failed to delete profile item', 500, error as Error);
  }
}
