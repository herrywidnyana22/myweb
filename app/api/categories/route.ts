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
    const categories = await prisma.category.findMany({
      include: {
        contacts: true,
        profiles: true,
        educations: true,
        experiences: true,
      },
    });

    return successResponse(categories, 'Categories fetched successfully');
  } catch (error) {
    console.error('Error fetching categories:', error);
    return errorResponse('Failed to fetch categories', 500, error as Error);
  } 
}

export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { name, icon } = body;

    if (!name) {
      return errorResponse('Name is required', 400);
    }

    const category = await prisma.category.create({
      data: {
        name,
        icon: icon || null,
      },
      include: {
        contacts: true,
        profiles: true,
        educations: true,
        experiences: true,
      },
    });

    return successResponse(category, 'Category created successfully', 201);
  } catch (error) {
    console.error('Error creating category:', error);
    return errorResponse('Failed to create category', 500, error as Error);
  }
}

