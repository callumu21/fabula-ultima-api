import { FastifyInstance } from 'fastify';
import { getAllStatusEffects, getStatusEffectById } from '../controllers/status-effects';

const statusEffectRoutes = async (server: FastifyInstance) => {
  server.get('/status-effects', getAllStatusEffects);
  server.get('/status-effects/:id', getStatusEffectById);
};

export default statusEffectRoutes;
