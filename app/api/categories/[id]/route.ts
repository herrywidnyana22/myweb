
import prisma from '@/lib/prisma';

import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-response';
import { cookies } from 'next/headers';
import { deleteImageFile } from '@/lib/file-utils';

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
      return errorResponse('Category ID is required', 400);
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        contacts: true,
        profiles: true,
        educations: true,
        experiences: true,
      },
    });

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    return successResponse(category, 'Category retrieved successfully');
  } catch (error) {
    console.error('Error fetching category:', error);
    return errorResponse('Failed to fetch category', 500, error as Error);
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
      return errorResponse('Category ID is required', 400);
    }

    const body = await req.json();
    const { name, icon } = body;

    if (!name) {
      return errorResponse('Name is required', 400);
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        ...(icon !== undefined && { icon }),
      },
      include: {
        contacts: true,
        profiles: true,
        educations: true,
        experiences: true,
      },
    });

    return successResponse(category, 'Category updated successfully');
  } catch (error) {
    console.error('Error updating category:', error);
    return errorResponse('Failed to update category', 500, error as Error);
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
      return errorResponse('Category ID is required', 400);
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        contacts: true,
        profiles: true,
        educations: true,
        experiences: true,
      },
    });

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    // Collect all image URLs to delete
    const imageUrls: (string | null)[] = [category.icon];
    
    // Add images from related items
    category.contacts.forEach(c => imageUrls.push(c.icon));
    category.profiles.forEach(p => imageUrls.push(p.photoURL));
    category.educations.forEach(e => {
      imageUrls.push(e.icon);
      imageUrls.push(e.schoolLogo);
    });
    category.experiences.forEach(e => imageUrls.push(e.icon));

    // Delete all related data before deleting category
    await Promise.all([
      prisma.contact.deleteMany({
        where: { categoryId: id },
      }),
      prisma.profile.deleteMany({
        where: { categoryId: id },
      }),
      prisma.education.deleteMany({
        where: { categoryId: id },
      }),
      prisma.experience.deleteMany({
        where: { categoryId: id },
      }),
    ]);

    // Delete the category
    await prisma.category.delete({
      where: { id },
    });

    // Delete all related image files
    await Promise.all(imageUrls.filter(Boolean).map(url => deleteImageFile(url)));

    return successResponse(null, 'Category and all related data deleted successfully');
  } catch (error) {
    console.error('Error deleting category:', error);
    return errorResponse('Failed to delete category', 500, error as Error);
  }
}

