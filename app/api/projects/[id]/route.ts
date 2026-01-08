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
      return errorResponse('Project ID is required', 400);
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
      return errorResponse('Project not found', 404);
    }

    return successResponse(project, 'Project retrieved successfully');
  } catch (error) {
    console.error('Error fetching project:', error);
    return errorResponse('Failed to fetch project', 500, error);
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
      return errorResponse('Project ID is required', 400);
    }

    const body = await req.json();
    const { name, icon, subIcon, tooltipText, description, techStack, categoryId, demoURL, repoURL, progressValue } = body;

    if (!name || !icon || !categoryId) {
      return errorResponse('Name, icon, and categoryId are required', 400);
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

    return successResponse(project, 'Project updated successfully');
  } catch (error) {
    console.error('Error updating project:', error);
    return errorResponse('Failed to update project', 500, error);
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
      return errorResponse('Project ID is required', 400);
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return errorResponse('Project not found', 404);
    }

    // Collect all entries to delete their images
    const entries = await prisma.projectEntry.findMany({
      where: { projectId: id },
    });

    // Delete all project entries first
    await prisma.projectEntry.deleteMany({
      where: { projectId: id },
    });

    // Then delete the project
    await prisma.project.delete({
      where: { id },
    });

    // Delete all image files
    const imageUrls: (string | null)[] = [project.icon, project.subIcon];
    
    // Add techStack icons
    if (project.techStack && Array.isArray(project.techStack)) {
      project.techStack.forEach((tech: any) => {
        if (tech?.techIcon) imageUrls.push(tech.techIcon);
      });
    }

    // Add entry images
    entries.forEach(entry => {
      imageUrls.push(entry.icon, entry.subIcon, entry.image);
    });

    await Promise.all(imageUrls.filter(Boolean).map(url => deleteImageFile(url)));

    return successResponse(null, 'Project and all related entries deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
    return errorResponse('Failed to delete project', 500, error);
  }
}
