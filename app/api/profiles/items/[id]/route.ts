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
        { error: 'Profile Item ID is required' },
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
      imageUrl,
      href,
      subtitle,
      description,
      tooltipText,
      extra,
    } = body;

    if (!name || !kind) {
      return NextResponse.json(
        { error: 'Name and kind are required' },
        { status: 400 }
      );
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

    return NextResponse.json(profileItem);
  } catch (error) {
    console.error('Error updating profile item:', error);
    return NextResponse.json(
      { error: 'Failed to update profile item' },
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
        { error: 'Profile Item ID is required' },
        { status: 400 }
      );
    }

    // Delete recursively (children will be deleted via cascade or manually)
    const deleteRecursive = async (itemId: string) => {
      const children = await prisma.profileItem.findMany({
        where: { parentId: itemId },
      });

      for (const child of children) {
        await deleteRecursive(child.id);
      }

      await prisma.profileItem.delete({
        where: { id: itemId },
      });
    };

    await deleteRecursive(id);

    return NextResponse.json({ message: 'Profile item deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile item:', error);
    return NextResponse.json(
      { error: 'Failed to delete profile item' },
      { status: 500 }
    );
  }
}
