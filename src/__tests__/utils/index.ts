import { FastifyInstance } from 'fastify';

type PlayerDetails = {
  userId: number;
  role: 'admin' | 'player';
};

export const getTestToken = (
  app: FastifyInstance,
  overrides: Partial<PlayerDetails> = {}
): string => {
  const payload: PlayerDetails = {
    userId: 1,
    role: 'admin',
    ...overrides,
  };

  return app.jwt.sign(payload);
};
