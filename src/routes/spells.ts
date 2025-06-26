import { FastifyInstance } from 'fastify';
import { getAllSpells, getSpellById } from '../controllers/spells';

const spellRoutes = async (server: FastifyInstance) => {
  server.get('/spells', getAllSpells);
  server.get('/spells/:id', getSpellById);
};

export default spellRoutes;
