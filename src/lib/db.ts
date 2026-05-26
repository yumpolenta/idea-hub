import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const databaseUrl =
    process.env.NODE_ENV === 'test'
        ? process.env.DATABASE_URL_TEST
        : process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error(
        process.env.NODE_ENV === 'test'
            ? 'DATABASE_URL_TEST is required to initialize Prisma Client in tests'
            : 'DATABASE_URL is required to initialize Prisma Client'
    );
}

const adapter = new PrismaPg({
    connectionString: databaseUrl,
});

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
