import { FastifyInstance } from 'fastify';
import { getAllSkills, getSkillById } from '../controllers/skills';

export const skillRoutes = async (server: FastifyInstance) => {
  server.get('/skills', getAllSkills);
  server.get('/skills/:id', getSkillById);
};
