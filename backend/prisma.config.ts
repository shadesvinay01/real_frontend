import { defineConfig } from '@prisma/config';
import { PrismaClient } from '@prisma/client';

export default defineConfig({
  earlyAccess: true,
  migrations: {
    url: process.env.DATABASE_URL,
  },
});
