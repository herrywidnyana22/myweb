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

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        category: true,
        entries: {
          include: {
            children: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
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
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, icon, subIcon, tooltipText, description, techStack, categoryId, demoURL, repoURL, progressValue } = body;

    if (!name || !icon || !categoryId) {
      return NextResponse.json(
        { error: 'Name, icon, and categoryId are required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      icon,
      categoryId,
    };

    if (subIcon !== undefined) {
      updateData.subIcon = subIcon;
    }
    if (tooltipText !== undefined) {
      updateData.tooltipText = tooltipText;
    }
    if (demoURL !== undefined) {
      updateData.demoURL = demoURL;
    }
    if (repoURL !== undefined) {
      updateData.repoURL = repoURL;
    }
    if (progressValue !== undefined) {
      updateData.progressValue = parseInt(progressValue, 10);
    }
    if (techStack !== undefined) {
      updateData.techStack = techStack;
    }
    // Handle description - convert array to string if needed
    if (description !== undefined) {
      updateData.description = Array.isArray(description) 
        ? (description.length > 0 ? description.join('\n') : '')
        : (description || '');
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        entries: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
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
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete all project entries first
    await prisma.projectEntry.deleteMany({
      where: { projectId: id },
    });

    // Then delete the project
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Project and all related entries deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
