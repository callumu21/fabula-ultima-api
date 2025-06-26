import { FastifyInstance } from 'fastify';
import { getAllSkills, getSkillById } from '../controllers/skills';

const skillRoutes = async (server: FastifyInstance) => {
  server.get('/skills', getAllSkills);
  server.get('/skills/:id', getSkillById);
};

export default skillRoutes;
