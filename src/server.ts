import Fastify from 'fastify';
import prismaPlugin from './plugins/prisma';
import { skillRoutes } from './routes/skills';

const buildServer = () => {
  const app = Fastify();

  app.register(prismaPlugin);

  app.get('/healthcheck', async () => {
    return { status: 'ok' };
  });

  app.register(skillRoutes);

  return app;
};

export default buildServer;
