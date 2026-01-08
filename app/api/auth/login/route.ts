import { NextResponse } from 'next/server';
import { createToken, verifyToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-response';

const VALID_USERNAME = 'herry';
const VALID_PASSWORD = 'herry*1234#';

export async function POST(req: Request) {
  try {
    const { username, password } = (await req.json()) as {
      username: string;
      password: string;
    };

    if (!username || !password) {
      return errorResponse('Username and password are required', 400);
    }

    if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
      return errorResponse('Invalid username or password', 401);
    }

    const token = await createToken(username);

    const response = NextResponse.json(
      {
        code: 200,
        status: 'ok',
        msg: 'Login successful',
        data: { success: true, username, token }
      },
      { status: 200 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('An error occurred during login', 500, error as Error);
  }
}
