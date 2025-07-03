import { FastifyInstance } from 'fastify';
import { getUsersCharacterById } from '../controllers/characters';

const characterRoutes = async (server: FastifyInstance) => {
  server.get('/characters/:id', {
    preHandler: [server.authenticate],
    handler: getUsersCharacterById,
  });
};

export default characterRoutes;
