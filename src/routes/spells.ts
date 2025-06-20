import { FastifyInstance } from 'fastify';

export async function spellRoutes(server: FastifyInstance) {
  server.get('/spells', async () => {
    const spells = await server.prisma.spell.findMany({
      include: { class: true },
    });
    return { spells };
  });
}
