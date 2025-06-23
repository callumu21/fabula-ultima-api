import { FastifyInstance } from 'fastify';

export async function skillRoutes(server: FastifyInstance) {
  server.get('/skills', async () => {
    const skills = await server.prisma.skill.findMany({
      include: { class: true },
    });
    return { skills };
  });

  server.get('/skills/:id', async (req, res) => {
    const { id } = req.params as { id: string };

    const skill = await server.prisma.skill.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!skill) {
      return res.status(404).send({ msg: 'Skill not found' });
    }

    return { skill };
  });
}
