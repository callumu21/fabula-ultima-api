import { FastifyInstance } from 'fastify';
import { getAllSpells, getSpellById } from '../controllers/spells';

export const spellRoutes = async (server: FastifyInstance) => {
  server.get('/spells', getAllSpells);
  server.get('/spells/:id', getSpellById);
};
