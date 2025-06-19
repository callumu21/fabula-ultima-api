import { PrismaClient } from '../../generated/prisma';

const { DB_ENDPOINT, DB_USERNAME, DB_PORT, DB_NAME, DB_PASSWORD } = process.env;
const url = `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_ENDPOINT}:${DB_PORT}/${DB_NAME}`;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: { db: { url } },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
