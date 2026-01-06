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
    const {
      name,
      kind,
      fileType,
      profileId,
      parentId,
      icon,
      imageUrl,
      href,
      subtitle,
      description,
      tooltipText,
      extra,
    } = body;

    if (!name || !kind || !profileId) {
      return NextResponse.json(
        { error: 'Name, kind, and profileId are required' },
        { status: 400 }
      );
    }

    // Verify profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const profileItem = await prisma.profileItem.create({
      data: {
        name,
        kind,
        fileType: fileType || null,
        profileId,
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

    return NextResponse.json(profileItem, { status: 201 });
  } catch (error) {
    console.error('Error creating profile item:', error);
    return NextResponse.json(
      { error: 'Failed to create profile item' },
      { status: 500 }
    );
  }
}
