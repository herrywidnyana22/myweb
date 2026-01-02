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
      projectId,
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

    if (!name || !kind || !projectId) {
      return NextResponse.json(
        { error: 'Name, kind, and projectId are required' },
        { status: 400 }
      );
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const projectEntry = await prisma.projectEntry.create({
      data: {
        name,
        kind,
        fileType: fileType || null,
        projectId,
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

    return NextResponse.json(projectEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating project entry:', error);
    return NextResponse.json(
      { error: 'Failed to create project entry' },
      { status: 500 }
    );
  }
}
