import { FastifyInstance } from 'fastify';

export async function spellRoutes(server: FastifyInstance) {
  server.get<{ Querystring: { withClass?: string } }>('/spells', async (req) => {
    const { withClass } = req.query;

    const spells = await server.prisma.spell.findMany({
      include: { class: withClass === 'true' },
    });
    return { spells };
  });

  server.get<{ Querystring: { withClass?: string } }>('/spells/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const { withClass } = req.query;

    const spell = await server.prisma.spell.findUnique({
      where: { id },
      include: { class: withClass === 'true' },
    });

    if (!spell) {
      return res.status(404).send({ msg: 'Spell not found' });
    }

    return { spell };
  });
}
