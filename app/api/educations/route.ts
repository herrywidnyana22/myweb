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
    const educations = await prisma.education.findMany({
      include: {
        category: true,
      },
    });

    return successResponse(educations, 'Educations fetched successfully');
  } catch (error) {
    console.error('Error fetching educations:', error);
    return errorResponse('Failed to fetch educations', 500, error as Error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { school, major, startYear, endYear, schoolLogo, icon, categoryId } =
      body;

    if (!school || !major || !startYear || !endYear || !categoryId) {
      return errorResponse(
        'School, major, startYear, endYear, and categoryId are required',
        400
      );
    }

    if (startYear > endYear) {
      return errorResponse('Start year cannot be greater than end year', 400);
    }

    const education = await prisma.education.create({
      data: {
        school,
        major,
        startYear: Number(startYear),
        endYear: Number(endYear),
        schoolLogo: schoolLogo || null,
        icon: icon || null,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return successResponse(education, 'Education created successfully', 201);
  } catch (error) {
    console.error('Error creating education:', error);
    return errorResponse('Failed to create education', 500, error as Error);
  }
}
