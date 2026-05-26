
import { beforeEach, afterAll } from 'vitest';

import { prisma } from '@/lib/db';
import { resetTestDatabase } from './test-db';

if (process.env.NODE_ENV !== 'test') {
    throw new Error('Test setup must run with NODE_ENV=test');
}

if (!process.env.DATABASE_URL_TEST?.includes('test')) {
    throw new Error('Refusing to reset a non-test database');
}

beforeEach(async () => {
    await resetTestDatabase();
});

afterAll(async () => {
    await prisma.$disconnect();
});
