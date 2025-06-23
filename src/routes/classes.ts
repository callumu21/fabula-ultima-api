import { FastifyInstance } from 'fastify';

export async function classRoutes(server: FastifyInstance) {
  server.get('/classes', async () => {
    const classes = await server.prisma.class.findMany({});

    return { classes };
  });

  server.get('/classes/:id', async (req, res) => {
    const { id } = req.params as { id: string };

    const foundClass = await server.prisma.class.findUnique({
      where: { id },
    });

    if (!foundClass) {
      return res.status(404).send({ msg: 'Class not found' });
    }

    return { class: foundClass };
  });
}
