import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { ListQuerySchema } from '@/schemas/query';
import { CreateIdeaSchema } from '@/schemas/idea';

const DEFAULT_OWNER_ID = '11111111-1111-4111-8111-111111111111';

export async function GET(request: Request) {
  const url = new URL(request.url);

  const rawQuery = {
    page: url.searchParams.get('page') ?? undefined,
    pageSize: url.searchParams.get('pageSize') ?? undefined,
    search: url.searchParams.get('search') ?? undefined,
    sortBy: url.searchParams.get('sortBy') ?? undefined,
    order: url.searchParams.get('order') ?? undefined,
  };

  const parsedQuery = ListQuerySchema.safeParse(rawQuery);

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        code: 'INVALID_QUERY',
        message: 'Query parameters are invalid',
        requestId: 'req-ideas-invalid-query',
        details: parsedQuery.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { page, pageSize, search, sortBy, order } = parsedQuery.data;

  const skip = (page - 1) * pageSize;

  const normalizedSearch = search?.trim();

  const where = normalizedSearch
    ? {
        title: {
          contains: normalizedSearch,
          mode: 'insensitive' as const,
        },
      }
    : undefined;

  const orderBy = {
    [sortBy]: order,
  };

  const [items, total] = await Promise.all([
    prisma.idea.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
    }),
    prisma.idea.count({
      where,
    }),
  ]);


  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = page < totalPages;

  return NextResponse.json(
    {
      items,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage,
      },
    },
    {
      status: 200,
      headers: new Headers({
        'Cache-Control': 'private, max-age=60',
      }),
    }
  );
}


export async function POST(request: Request) {
  const rawBody: unknown = await request.json();
  

  const parsedBody = CreateIdeaSchema.safeParse(rawBody);


  if (!parsedBody.success) {
    return NextResponse.json(
      {
        code: 'INVALID_BODY',
        message: 'Request body is invalid',
        requestId: 'req-ideas-invalid-body',
        details: parsedBody.error.flatten(),
      },
      { status: 400 }
    );
  } 

  const { title, status } = parsedBody.data;

  const newIdea = await prisma.idea.create({
    data: {
      title,
      status,
      ownerId: DEFAULT_OWNER_ID,
    },
  });


  return NextResponse.json(
    newIdea,
    {
      status: 201,
      headers: new Headers({
        'Content-Type':'application/json; charset=utf-8',
        Location: `/api/ideas/${newIdea.id}`
      })
    }
  );
}
