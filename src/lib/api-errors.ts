import { NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma/client';
type ErrorPayload = {
  code: string;
  message: string;
  requestId: string;
  details?: unknown;
};

type ApiError = ErrorPayload & {
  status: 400 | 404 | 409 | 500;
};

export function errorResponse(error: ApiError) {
  const { status, ...body } = error;

  return NextResponse.json(body, { status });
}


export function badRequest(payload: ErrorPayload) {
  return errorResponse({ ...payload, status: 400 });
}

export function notFound(payload: ErrorPayload) {
  // TODO:
  // 返回 404 JSON
  return errorResponse({ ...payload, status: 404});
}

export function conflict(payload: ErrorPayload) {
  // TODO:
  // 409
  return errorResponse({ ...payload, status: 409});
}

export function internalServerError(payload: ErrorPayload) {
  // TODO:
  // 500
  return errorResponse({ ...payload, status: 500});
}

export function mapDatabaseError(error: unknown, requestId: string): ApiError
{
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return {
        code: 'CONFLICT',
        message: 'Resource already exists',
        requestId,
        status: 409,
      };
    }

    if (error.code === 'P2025') {
      return {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        requestId,
        status: 404,
      };
    }
  }

  return {
    code: 'DATABASE_ERROR',
    message: 'Database error',
    requestId,
    status: 500,
  };
}
