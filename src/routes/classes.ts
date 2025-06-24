import { FastifyInstance } from 'fastify';
import { getAllClasses, getClassById } from '../controllers/classes';

export const classRoutes = async (server: FastifyInstance) => {
  server.get('/classes', getAllClasses);
  server.get('/classes/:id', getClassById);
};
