import { FastifyInstance } from 'fastify';
import { getAllWeapons, getWeaponById } from '../controllers/weapons';

export const weaponRoutes = async (server: FastifyInstance) => {
  server.get('/weapons', getAllWeapons);
  server.get('/weapons/:id', getWeaponById);
};
