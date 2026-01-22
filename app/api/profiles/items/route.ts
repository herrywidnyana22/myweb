import prisma from '@/lib/prisma';
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

export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth) {
      return errorResponse('Unauthorized', 401);
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
      return errorResponse('Name, kind, and profileId are required', 400);
    }

    // Verify profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return errorResponse('Profile not found', 404);
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

    return successResponse(
      profileItem,
      'Profile item created successfully',
      201
    );
  } catch (error) {
    console.error('Error creating profile item:', error);
    return errorResponse('Failed to create profile item', 500, error as Error);
  }
}
