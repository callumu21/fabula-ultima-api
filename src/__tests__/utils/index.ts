import { FastifyInstance } from 'fastify';

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
