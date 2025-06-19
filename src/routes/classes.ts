import { FastifyInstance } from 'fastify';

export async function classRoutes(server: FastifyInstance) {
  server.get('/classes', async () => {
    const classes = await server.prisma.class.findMany({});

    return { classes };
  });
}
