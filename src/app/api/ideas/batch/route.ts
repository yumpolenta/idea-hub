import { NextResponse } from 'next/server';
import { z } from 'zod';
import { badRequest } from '@/lib/api-errors';
import { mockIdeas } from '@/lib/mock-ideas';

const BatchQuerySchema = z.object({
  ids: z
    .string()
    .min(1)
    .transform((value) =>
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    )
    .pipe(z.array(z.uuid()).min(1)),
});

export async function GET(request: Request) {
  const url = new URL(request.url);

  const rawQuery = {
    ids: url.searchParams.get('ids') ?? '',
  };

  // TODO 1:
  // 校验 rawQuery
  const parsedQuery = BatchQuerySchema.safeParse(rawQuery);

  if(!parsedQuery.success){
    const payload = {
        code: 'INVALID_QUERY',
        message: 'Query parameters are invalid',
        requestId: 'req-ideas-invalid-query',
        details: parsedQuery.error.flatten(),
    }
    return badRequest(payload)
  }

  // TODO 2:
  // 从 parsed.data.ids 中筛选匹配的 ideas
  const items = parsedQuery.success
    ? mockIdeas.filter((item) => parsedQuery.data.ids.includes(item.id))
    : [];

  // TODO 3:
  // 返回 200 + items
  return NextResponse.json(
    {
      items,
    },
    { status: 200 }
  );
}
