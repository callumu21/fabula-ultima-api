import { FastifyInstance } from 'fastify';
import { getAllClasses, getClassById } from '../controllers/classes';

const classRoutes = async (server: FastifyInstance) => {
  server.get('/classes', getAllClasses);
  server.get('/classes/:id', getClassById);
};

export default classRoutes;
