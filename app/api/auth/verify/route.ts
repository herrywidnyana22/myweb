import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-response';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return errorResponse('No token found', 401);
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return errorResponse('Invalid token', 401);
    }

    return successResponse({ username: payload.username }, 'Token verified successfully');
  } catch (error) {
    console.error('Verification error:', error);
    return errorResponse('Token verification failed', 500, error);
  }
}

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        code: 200,
        status: 'ok',
        msg: 'Logged out successfully',
        data: { success: true }
      },
      { status: 200 }
    );

    response.cookies.delete('auth_token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse('An error occurred during logout', 500, error);
  }
}
