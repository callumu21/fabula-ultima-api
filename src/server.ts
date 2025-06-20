import Fastify from 'fastify';
import prismaPlugin from './plugins/prisma';
import { classRoutes } from './routes/classes';
import { skillRoutes } from './routes/skills';
import { spellRoutes } from './routes/spells';

const buildServer = () => {
  const app = Fastify();

  app.register(prismaPlugin);

  app.get('/healthcheck', async () => {
    return { status: 'ok' };
  });

  app.register(classRoutes);
  app.register(skillRoutes);
  app.register(spellRoutes);

  return app;
};

export default buildServer;
