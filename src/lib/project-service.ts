
import { prisma } from '@/lib/db';

const DEFAULT_OWNER_ID = '11111111-1111-4111-8111-111111111111';

type CreateProjectInput = {
    name: string;
    slug: string;
};

export async function createProjectWithDefaultTasks(input: CreateProjectInput)
{
    return prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
            data:{
                name: input.name ,
                slug: input.slug,
                ownerId: DEFAULT_OWNER_ID
            },
        });
        await tx.task.createMany({
            data:[
                {
                    title: 'Define MVP',
                    ownerId: DEFAULT_OWNER_ID,
                    projectId: project.id
                },
                {
                    title: 'Review launch checklist',
                    ownerId: DEFAULT_OWNER_ID,
                    projectId: project.id
                },
            ],
        })
        return project;
    });
}
