import Fastify from 'fastify';

export const buildServer = () => {
  const app = Fastify();

  app.get('/healthcheck', async () => {
    return { status: 'ok' };
  });

  return app;
};
