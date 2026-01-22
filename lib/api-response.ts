import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  code: number;
  status: 'ok' | 'error';
  msg: string;
  data: T | null;
  error?: string;
}

export function successResponse<T>(
  data: T,
  message: string = 'Success',
  statusCode: number = 200
) {
  return NextResponse.json<ApiResponse<T>>(
    {
      code: statusCode,
      status: 'ok',
      msg: message,
      data,
    },
    { status: statusCode }
  );
}

export function errorResponse(
  message: string,
  statusCode: number = 500,
  error?: string | Error
) {
  return NextResponse.json<ApiResponse>(
    {
      code: statusCode,
      status: 'error',
      msg: message,
      data: null,
      error: error instanceof Error ? error.message : error,
    },
    { status: statusCode }
  );
}
