import { PrismaClient } from '../../../generated/prisma';
import { FastifyInstance } from 'fastify';

export const resetDb = async (prismaInstance: PrismaClient): Promise<void> => {
  const tableNames = await prismaInstance.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const truncationPromises = tableNames.map(({ tablename }) => {
    if (tablename !== '_prisma_migrations') {
      return prismaInstance
        .$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`)
        .catch((err) => {
          console.error(err);
        });
    }
    return null;
  });

  await Promise.all(truncationPromises);
};

type PlayerDetails = {
  userId: number;
  role: 'ADMIN' | 'PLAYER';
};

export const getTestToken = (
  app: FastifyInstance,
  overrides: Partial<PlayerDetails> = {}
): string => {
  const payload: PlayerDetails = {
    userId: 1,
    role: 'PLAYER',
    ...overrides,
  };

  return app.jwt.sign(payload);
};
