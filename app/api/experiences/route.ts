import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
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
    const experiences = await prisma.experience.findMany({
      include: {
        category: true,
      },
    });

    return successResponse(experiences, 'Experiences fetched successfully');
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return errorResponse('Failed to fetch experiences', 500, error as Error);
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
      company,
      role,
      location,
      start,
      end,
      jobdesk,
      description,
      icon,
      categoryId,
    } = body;

    if (!company || !role || !location || !start || !end || !categoryId) {
      return errorResponse(
        'Company, role, location, start, end, and categoryId are required',
        400
      );
    }

    const experience = await prisma.experience.create({
      data: {
        company,
        role,
        location,
        start,
        end,
        jobdesk: jobdesk || null,
        description: description || null,
        icon: icon || null,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return successResponse(experience, 'Experience created successfully', 201);
  } catch (error) {
    console.error('Error creating experience:', error);
    return errorResponse('Failed to create experience', 500, error as Error);
  }
}
