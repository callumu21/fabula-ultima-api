import { FastifyInstance } from 'fastify';

export async function skillRoutes(server: FastifyInstance) {
  server.get('/skills', async () => {
    const skills = await server.prisma.skill.findMany({
      include: { class: true },
    });
    return { skills };
  });
}
