import 'fastify';
import '@fastify/jwt';
import prisma from '../lib/prisma';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    jwt: import('@fastify/jwt').FastifyJWT;
    prisma: typeof prisma;
  }

  interface FastifyRequest {
    jwtVerify: () => Promise<void>;
    user: {
      userId: number;
      role: string;
    };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: number;
      role: 'admin' | 'player';
    };
    user: {
      userId: number;
      role: 'admin' | 'player';
    };
  }
}
