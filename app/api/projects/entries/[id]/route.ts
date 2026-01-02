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
        { error: 'Project Entry ID is required' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'Name and kind are required' },
        { status: 400 }
      );
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

    return NextResponse.json(projectEntry);
  } catch (error) {
    console.error('Error updating project entry:', error);
    return NextResponse.json(
      { error: 'Failed to update project entry' },
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
        { error: 'Project Entry ID is required' },
        { status: 400 }
      );
    }

    const projectEntry = await prisma.projectEntry.findUnique({
      where: { id },
      include: {
        children: true,
      },
    });

    if (!projectEntry) {
      return NextResponse.json(
        { error: 'Project Entry not found' },
        { status: 404 }
      );
    }

    // Delete all children recursively
    const deleteChildren = async (parentId: string) => {
      const children = await prisma.projectEntry.findMany({
        where: { parentId },
      });

      for (const child of children) {
        await deleteChildren(child.id);
        await prisma.projectEntry.delete({
          where: { id: child.id },
        });
      }
    };

    await deleteChildren(id);

    // Delete the entry itself
    await prisma.projectEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Project entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting project entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete project entry' },
      { status: 500 }
    );
  }
}
