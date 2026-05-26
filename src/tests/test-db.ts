  import { prisma } from '@/lib/db';

export const TEST_OWNER_ID = '11111111-1111-4111-8111-111111111111';

export async function resetTestDatabase() {
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.idea.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.create({ data: {
        id: TEST_OWNER_ID,
        email: 'test-owner@example.com',
        name: 'Solo Founder',
    }})
  }

  export async function createTestIdea(overrides?: {
    id?: string;
    title?: string;
    status?: string;
  }) {

    const testidea = prisma.idea.create({data:{
        id: overrides?.id,
        ownerId: TEST_OWNER_ID,
        title: overrides?.title ?? 'AI landing page generator',
        status: overrides?.status ?? 'draft',
    }})
    return testidea;
  }
