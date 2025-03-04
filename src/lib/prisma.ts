import { PrismaClient } from '@prisma/client';

import { env } from '@/env';

export const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: env.NODE_ENV === 'dev' ? ['error', 'warn', 'query'] : [],
});
