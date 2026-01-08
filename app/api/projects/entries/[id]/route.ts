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
      return errorResponse('Project Entry ID is required', 400);
    }

    const body = await req.json();
    const {
      name,
      kind,
      fileType,
      parentId,
      icon,
      subIcon,
      tooltipText,
      href,
      imageUrl,
      subtitle,
      progress,
      description,
      techStack,
      extra,
    } = body;

    if (!name || !kind) {
      return errorResponse('Name and kind are required', 400);
    }

    const projectEntry = await prisma.projectEntry.update({
      where: { id },
      data: {
        name,
        kind,
        fileType: fileType || null,
        parentId: parentId || null,
        icon: icon || null,
        subIcon: subIcon || null,
        tooltipText: tooltipText || null,
        href: href || null,
        imageUrl: imageUrl || null,
        subtitle: subtitle || null,
        progress: progress ? parseInt(progress, 10) : null,
        description: description || null,
        techStack: techStack || null,
        extra: extra || null,
      },
      include: {
        children: true,
      },
    });

    return successResponse(projectEntry, 'Project entry updated successfully');
  } catch (error) {
    console.error('Error updating project entry:', error);
    return errorResponse('Failed to update project entry', 500, error as Error);
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
      return errorResponse('Project Entry ID is required', 400);
    }

    const projectEntry = await prisma.projectEntry.findUnique({
      where: { id },
      include: {
        children: true,
      },
    });

    if (!projectEntry) {
      return errorResponse('Project Entry not found', 404);
    }

    // Delete all children recursively
    const deleteChildren = async (parentId: string) => {
      const children = await prisma.projectEntry.findMany({
        where: { parentId },
      });

      for (const child of children) {
        await deleteChildren(child.id);
        
        // Delete child from database
        await prisma.projectEntry.delete({
          where: { id: child.id },
        });

        // Delete child images
        await Promise.all([
          deleteImageFile(child.icon),
          deleteImageFile(child.subIcon),
          deleteImageFile(child.imageUrl)
        ]);
      }
    };

    await deleteChildren(id);

    // Delete the entry itself
    await prisma.projectEntry.delete({
      where: { id },
    });

    // Delete entry images
    await Promise.all([
      deleteImageFile(projectEntry.icon),
      deleteImageFile(projectEntry.subIcon),
      deleteImageFile(projectEntry.imageUrl)
    ]);

    return successResponse(null, 'Project entry deleted successfully');
  } catch (error) {
    console.error('Error deleting project entry:', error);
    return errorResponse('Failed to delete project entry', 500, error as Error);
  }
}
