import { successResponse, errorResponse } from '@/lib/api-response';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      return errorResponse('File must be a PDF', 400);
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return errorResponse('File size must be less than 10MB', 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const filename = `${timestamp}-${randomString}.pdf`;

    // Create files directory if it doesn't exist
    const filesDir = join(process.cwd(), 'public', 'files');
    if (!existsSync(filesDir)) {
      await mkdir(filesDir, { recursive: true });
    }

    // Write file to public/files
    const filepath = join(filesDir, filename);
    const buffer = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer));

    // Return the relative URL
    const fileUrl = `/files/${filename}`;

    return successResponse({ url: fileUrl }, 'File uploaded successfully', 201);
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse('Failed to upload file', 500, error as Error);
  }
}
