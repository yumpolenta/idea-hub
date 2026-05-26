import { NextResponse } from 'next/server';
import { z } from 'zod';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import { badRequest, notFound, errorResponse, mapDatabaseError } from '@/lib/api-errors';
import { UpdateIdeaSchema } from '@/schemas/idea';

const IdeaIdParamSchema = z.object({
  id: z.uuid(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params;

  const parsedParams = IdeaIdParamSchema.safeParse(params);

  if (!parsedParams.success) {
    return badRequest({
      code: 'INVALID_ID',
      message: 'Idea id is invalid',
      requestId: 'req-ideas-invalid-id',
      details: parsedParams.error.flatten(),
    });
  }

  const { id } = parsedParams.data;

  const idea = await prisma.idea.findUnique({
    where: { id },
  });

  if (!idea) {
    return notFound({
      code: 'NOT_FOUND',
      message: 'Idea not found',
      requestId: 'req-ideas-not-found',
    });
  }

  return NextResponse.json(
      idea,
      {status: 200}
    )
  } 

export async function PATCH(request: Request, context: RouteContext) {
  const params = await context.params;

  const parsedParams = IdeaIdParamSchema.safeParse(params);

  if (!parsedParams.success) {
    return badRequest({
      code: 'INVALID_ID',
      message: 'Idea id is invalid',
      requestId: 'req-ideas-invalid-id',
      details: parsedParams.error.flatten(),
    });
  }

  const rawBody: unknown = await request.json();
  
  const parsedBody = UpdateIdeaSchema.safeParse(rawBody);

  if (!parsedBody.success) {
    return badRequest({
      code: 'INVALID_BODY',
      message: 'Request body is invalid',
      requestId: 'req-ideas-invalid-body',
      details: parsedBody.error.flatten(),
    });
  } 

  const { id } = parsedParams.data;

  const { title, status } = parsedBody.data;

  const updateData: { title?: string; status?: string } = {};

  if (title !== undefined) {
    updateData.title = title;
  }

  if (status !== undefined) {
    updateData.status = status;
  }

  if (Object.keys(updateData).length === 0) {
    return badRequest({
      code: 'INVALID_BODY',
      message: 'Request body must include at least one writable field',
      requestId: 'req-ideas-invalid-body',
    });
  }

  try {
    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      updatedIdea,
      {status: 200}
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return notFound({
        code: 'NOT_FOUND',
        message: 'Idea not found',
        requestId: 'req-ideas-not-found',
      });
    }

    throw error;
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const params = await context.params;

  // TODO 1:
  // 校验 params.id
  const parsedParams = IdeaIdParamSchema.safeParse(params);

  if (!parsedParams.success) {
    return badRequest({
      code: 'INVALID_ID',
      message: 'Idea id is invalid',
      requestId: 'req-ideas-invalid-id',
      details: parsedParams.error.flatten(),
    });
  }

  const { id } = parsedParams.data;
  try{
    await prisma.idea.delete({where: {id}});
    return new NextResponse(
      null,
      {status:204}
    );
  }catch (error) {
    const apiError = mapDatabaseError(error, 'req-ideas-database-error');

    if (apiError.status === 500) {
      console.error(error);
    }

    return errorResponse(apiError);
  }

}
