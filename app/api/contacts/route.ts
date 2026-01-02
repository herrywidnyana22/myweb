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
    const contacts = await prisma.contact.findMany({
      include: {
        category: true,
      },
    });

    // Map Prisma Contact fields to expected component format
    const formatted = contacts.map((contact) => ({
      id: contact.id,
      type: 'contact',
      title: contact.title,
      description: contact.description,
      icon: contact.icon,
      bgColor: contact.bgColor,
      href: contact.contactURL,
      tooltipText: contact.tooltipText,
      categoryId: contact.categoryId,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
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
    const { title, description, tooltipText, icon, bgColor, contactURL, categoryId } = body;

    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { error: 'Title, Description, and Category ID are required' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        title,
        description,
        tooltipText: tooltipText || null,
        icon: icon || null,
        bgColor: bgColor || null,
        contactURL: contactURL || null,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}
