import { describe, expect, it } from 'vitest';

import { CreateIdeaSchema, UpdateIdeaSchema } from '@/schemas/idea';
import { GET as batchIdeas } from '@/app/api/ideas/batch/route';
import { DELETE as deleteIdea, GET as getIdeaById, PATCH as patchIdea } from '@/app/api/ideas/[id]/route';
import { GET as listIdeas, POST as createIdea } from '@/app/api/ideas/route';
import { createTestIdea, TEST_OWNER_ID } from './test-db';
import { prisma } from '@/lib/db';

function createRouteContext(id: string) {
  return {
    params: Promise.resolve({ id }),
  };
}

async function readJson(response: Response) {
  return response.json();
}

describe('CreateIdeaSchema', () => {
  it('accepts valid input', () => {
    const result = CreateIdeaSchema.safeParse({
      title: 'A valid idea',
      status: 'draft',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid title', () => {
    const result = CreateIdeaSchema.safeParse({
      title: 'A',
      content: 'Useful details',
      status: 'draft',
      tags: ['ai'],
    });

    expect(result.success).toBe(false);
  });
});

describe('UpdateIdeaSchema', () => {
  it('rejects unknown fields', () => {
    const result = UpdateIdeaSchema.safeParse({
      title: 'Updated title',
      ownerId: 'not-allowed',
    });

    expect(result.success).toBe(false);
  });
});

describe('Ideas API success paths', () => {
  it('GET /ideas returns 200 with paginated items', async () => {
    const request = new Request('http://localhost:3000/api/ideas?page=1&pageSize=2');
    const response = await listIdeas(request);
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('private, max-age=60');
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.meta.page).toBe(1);
    expect(body.meta.pageSize).toBe(2);
  });
  
  it('GET /ideas/:id returns 200 for an existing idea', async () => {
    const idea = await createTestIdea({
      title: 'Detail test idea',
      status: 'published',
    });

    const request = new Request(`http://localhost:3000/api/ideas/${idea.id}`);

    const response = await getIdeaById(request, createRouteContext(idea.id));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.id).toBe(idea.id);
    expect(body.title).toBe('Detail test idea');
    expect(body.status).toBe('published');

  });


  it('POST /ideas returns 201 for valid body', async () => {
    const request = new Request('http://localhost:3000/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'New idea',
        status: 'draft',
      }),
    });

    const response = await createIdea(request);
    const body = await readJson(response);

    expect(response.status).toBe(201);
    expect(response.headers.get('Location')).toMatch(/^\/api\/ideas\/.+/);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(body.title).toBe('New idea');
    expect(body.id).toBeDefined();
    expect(body.createdAt).toBeDefined();
  });

  it('POST /ideas persists the created idea in the database', async () => {
    const request = new Request('http://localhost:3000/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Persisted idea',
        status: 'draft',
      }),
    });

    const response = await createIdea(request);
    const body = await readJson(response);

    expect(response.status).toBe(201);

    const foundIdea = await prisma.idea.findUnique({ where: { id: body.id } });

    expect(foundIdea).not.toBeNull();
    expect(foundIdea?.title).toBe(body.title);
    expect(foundIdea?.status).toBe(body.status);
    expect(foundIdea?.ownerId).toBe(TEST_OWNER_ID);
  });

  it('PATCH /ideas/:id returns 200 for valid partial update', async () => {
    const idea = await createTestIdea();

    const request = new Request(`http://localhost:3000/api/ideas/${idea.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Updated title',
      }),
    });

    const response = await patchIdea(request, createRouteContext(idea.id));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.title).toBe('Updated title');
  });

  it('DELETE /ideas/:id returns 204 for existing resource', async () => {
    const idea = await createTestIdea();

    const request = new Request(`http://localhost:3000/api/ideas/${idea.id}`, {
      method: 'DELETE',
    });

    const response = await deleteIdea(request, createRouteContext(idea.id));

    expect(response.status).toBe(204);
  });

  it('DELETE /ideas/:id removes the idea from the database', async () => {
    const idea = await createTestIdea();

    const request = new Request(`http://localhost:3000/api/ideas/${idea.id}`, {
      method: 'DELETE',
    });

    const response = await deleteIdea(request, createRouteContext(idea.id));
    
    expect(response.status).toBe(204);
    const foundIdea = await prisma.idea.findUnique({ where: { id: idea.id } });
    expect(foundIdea).toBeNull();

  });
});





describe('Ideas API failure paths', () => {
  it('GET /ideas returns 400 for invalid page query', async () => {
    const request = new Request('http://localhost:3000/api/ideas?page=0');
    const response = await listIdeas(request);
    const body = await readJson(response);

    expect(response.status).toBe(400);
    expect(body.code).toBe('INVALID_QUERY');
  });

  it('GET /ideas/:id returns 400 for invalid UUID', async () => {
    const request = new Request('http://localhost:3000/api/ideas/not-a-uuid');
    const response = await getIdeaById(request, createRouteContext('not-a-uuid'));
    const body = await readJson(response);

    expect(response.status).toBe(400);
    expect(body.code).toBe('INVALID_ID');
  });

  it('PATCH /ideas/:id returns 400 for invalid body', async () => {
    const request = new Request('http://localhost:3000/api/ideas/550e8400-e29b-41d4-a716-446655440000', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'A',
      }),
    });

    const response = await patchIdea(request, createRouteContext('550e8400-e29b-41d4-a716-446655440000'));
    const body = await readJson(response);

    expect(response.status).toBe(400);
    expect(body.code).toBe('INVALID_BODY');
  });

  it('DELETE /ideas/:id returns 404 for missing resource', async () => {
    const request = new Request('http://localhost:3000/api/ideas/550e8400-e29b-41d4-a716-446655440099', {
      method: 'DELETE',
    });

    const response = await deleteIdea(request, createRouteContext('550e8400-e29b-41d4-a716-446655440099'));
    const body = await readJson(response);

    expect(response.status).toBe(404);
    expect(body.code).toBe('NOT_FOUND');
  });

  it('GET /ideas/batch returns 400 for invalid ids query', async () => {
    const request = new Request('http://localhost:3000/api/ideas/batch?ids=not-a-uuid');
    const response = await batchIdeas(request);
    const body = await readJson(response);

    expect(response.status).toBe(400);
    expect(body.code).toBe('INVALID_QUERY');
  });
});
