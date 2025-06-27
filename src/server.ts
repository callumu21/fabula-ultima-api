import Fastify from 'fastify';
import ajvErrors from 'ajv-errors';
import authPlugin from './plugins/auth';
import prismaPlugin from './plugins/prisma';
import authRoutes from './routes/auth';
import classRoutes from './routes/classes';
import skillRoutes from './routes/skills';
import spellRoutes from './routes/spells';
import weaponRoutes from './routes/weapons';

const buildServer = () => {
  const app = Fastify({
    ajv: {
      customOptions: { allErrors: true, coerceTypes: false },
      plugins: [ajvErrors],
    },
    schemaErrorFormatter: (errors) => {
      const [firstError] = errors;
      return new Error(firstError.message || 'Invalid input.');
    },
  });

  app.register(authPlugin);
  app.register(prismaPlugin);

  app.register(authRoutes);

  app.get('/healthcheck', async () => {
    return { status: 'ok' };
  });

  app.register(classRoutes);
  app.register(skillRoutes);
  app.register(spellRoutes);
  app.register(weaponRoutes);

  app.setErrorHandler((err, req, reply) => {
    if (err.validation) {
      return reply.status(400).send({
        statusCode: 400,
        msg: err.message,
      });
    }

    return reply.send(err);
  });

  return app;
};

export default buildServer;
