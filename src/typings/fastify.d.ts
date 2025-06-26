import 'fastify';
import '@fastify/jwt';
import prisma from '../lib/prisma';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizeAdmin: (req: FastifyRequest, FastifyReply) => Promise<void>;
    jwt: import('@fastify/jwt').FastifyJWT;
    prisma: typeof prisma;
  }

  interface FastifyRequest {
    jwtVerify: () => Promise<void>;
    user: {
      userId: number;
      role: 'ADMIN' | 'PLAYER';
    };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: number;
      role: 'ADMIN' | 'PLAYER';
    };
    user: {
      userId: number;
      role: 'ADMIN' | 'PLAYER';
    };
  }
}
