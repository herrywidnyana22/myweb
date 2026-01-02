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

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        category: true,
        entries: {
          include: {
            children: true,
          },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
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
    const { name, icon, subIcon, tooltipText, description, techStack, categoryId, demoURL, repoURL, progressValue } = body;

    if (!name || !icon || !categoryId) {
      return NextResponse.json(
        { error: 'Name, icon, and categoryId are required' },
        { status: 400 }
      );
    }

    const projectData: any = {
      name,
      icon,
      subIcon: subIcon || null,
      tooltipText: tooltipText || null,
      techStack: techStack || null,
      categoryId,
      demoURL: demoURL || null,
      repoURL: repoURL || null,
      progressValue: progressValue ? parseInt(progressValue, 10) : 0,
    };

    // Handle description - convert array to string if needed
    if (description !== undefined) {
      const descriptionValue = Array.isArray(description) 
        ? (description.length > 0 ? description.join('\n') : '')
        : (description || '');
      projectData.description = descriptionValue;
    } else {
      projectData.description = '';
    }

    const project = await prisma.project.create({
      data: projectData,
      include: {
        category: true,
        entries: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
