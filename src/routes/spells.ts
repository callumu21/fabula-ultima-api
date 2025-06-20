import { FastifyInstance } from 'fastify';

export async function spellRoutes(server: FastifyInstance) {
  server.get('/spells', async () => {
    const spells = await server.prisma.spell.findMany({
      include: { class: true },
    });
    return { spells };
  });

  server.get('/spells/:id', async (req, res) => {
    const { id } = req.params as { id: string };

    const spell = await server.prisma.spell.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!spell) {
      return res.status(404).send({ msg: 'Spell not found' });
    }

    return { spell };
  });
}
