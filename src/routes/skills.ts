import { FastifyInstance } from 'fastify';

export async function skillRoutes(server: FastifyInstance) {
  server.get<{ Querystring: { withClass?: string } }>('/skills', async (req) => {
    const { withClass } = req.query;

    const skills = await server.prisma.skill.findMany({
      include: { class: withClass === 'true' },
    });
    return { skills };
  });

  server.get<{ Querystring: { withClass?: string } }>('/skills/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const { withClass } = req.query;

    const skill = await server.prisma.skill.findUnique({
      where: { id },
      include: { class: withClass === 'true' },
    });

    if (!skill) {
      return res.status(404).send({ msg: 'Skill not found' });
    }

    return { skill };
  });
}
