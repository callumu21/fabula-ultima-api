import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { FastifyPluginAsync } from 'fastify';
import 'dotenv/config';

const secret = process.env.JWT_SECRET;

if (!secret) throw new Error('Missing environment variable');

const authPlugin: FastifyPluginAsync = fp(async (server) => {
  server.register(fastifyJwt, {
    secret,
  });

  server.decorate('authenticate', async function (req, reply) {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  server.decorate('authorizeAdmin', async function (req, reply) {
    try {
      await req.jwtVerify();
      if (req.user.role !== 'ADMIN') {
        return reply.code(403).send({ msg: 'Invalid authorisation.' });
      }
    } catch (err) {
      reply.send(err);
    }
  });
});

export default authPlugin;
