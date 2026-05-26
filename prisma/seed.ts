import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run prisma/seed.ts');
}

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
});
const ownerId = '11111111-1111-4111-8111-111111111111';
const user = {
    id: ownerId,
    email: 'founder@example.com',
    name: 'Solo Founder',
};

const projectIds = {
    ideaHub: '660e8400-e29b-41d4-a716-446655440000',
    founderOps: '660e8400-e29b-41d4-a716-446655440001',
};


const projects = [
    {
        id: projectIds.ideaHub,
        ownerId,
        name: 'Idea Hub',
        slug: 'idea-hub',
        status: 'active',
        createdAt: new Date('2026-05-01T08:00:00.000Z'),
    },
    {
        id: projectIds.founderOps,
        ownerId,
        name: 'Founder Operations',
        slug: 'founder-operations',
        status: 'active',
        createdAt: new Date('2026-05-02T08:00:00.000Z'),
    },
];

const ideas = [
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        ownerId,
        title: 'AI landing page generator',
        status: 'draft',
        createdAt: new Date('2026-04-20T08:00:00.000Z'),
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        ownerId,
        title: 'Founder CRM',
        status: 'archived',
        createdAt: new Date('2026-04-21T08:00:00.000Z'),
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        ownerId,
        title: 'Solo analytics dashboard',
        status: 'draft',
        createdAt: new Date('2026-04-22T08:00:00.000Z'),
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        ownerId,
        title: 'photo ocr',
        status: 'draft',
        createdAt: new Date('2026-04-23T08:00:00.000Z'),
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        ownerId,
        title: 'video search engine',
        status: 'draft',
        createdAt: new Date('2026-04-24T08:00:00.000Z'),
    }
];


const tasks = [
    {
        id: '770e8400-e29b-41d4-a716-446655440000',
        ownerId,
        projectId: projectIds.ideaHub,
        title: 'Write OpenAPI examples for ideas',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2026-05-20T08:00:00.000Z'),
        createdAt: new Date('2026-05-10T08:00:00.000Z'),
    },
    {
        id: '770e8400-e29b-41d4-a716-446655440001',
        ownerId,
        projectId: projectIds.ideaHub,
        title: 'Add database error mapping',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2026-05-21T08:00:00.000Z'),
        createdAt: new Date('2026-05-11T08:00:00.000Z'),
    },
    {
        id: '770e8400-e29b-41d4-a716-446655440002',
        ownerId,
        projectId: projectIds.founderOps,
        title: 'Review weekly founder metrics',
        status: 'in_progress',
        priority: 'medium',
        dueDate: new Date('2026-05-22T08:00:00.000Z'),
        createdAt: new Date('2026-05-12T08:00:00.000Z'),
    },
    {
        id: '770e8400-e29b-41d4-a716-446655440003',
        ownerId,
        projectId: null,
        title: 'Clean up learning logs',
        status: 'todo',
        priority: 'low',
        dueDate: null,
        createdAt: new Date('2026-05-13T08:00:00.000Z'),
    },
];

async function main() {
    const [, , , , , ideaResult, projectResult, taskResult] = await prisma.$transaction([
        prisma.task.deleteMany(),
        prisma.project.deleteMany(),
        prisma.idea.deleteMany(),
        prisma.user.deleteMany(),
        prisma.user.create({ data: user }),
        prisma.idea.createMany({ data: ideas }),
        prisma.project.createMany({ data: projects }),
        prisma.task.createMany({ data: tasks }),
    ]);

    console.log(
        `Seeded ${ideaResult.count} ideas, ${projectResult.count} projects, and ${taskResult.count} tasks`
    );
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
