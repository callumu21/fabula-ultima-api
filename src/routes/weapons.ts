import { FastifyInstance } from 'fastify';
import { getAllWeapons, getWeaponById, handleDeleteWeaponById } from '../controllers/weapons';

export const weaponRoutes = async (server: FastifyInstance) => {
  server.get('/weapons', getAllWeapons);

  server.get('/weapons/:id', getWeaponById);
  server.delete('/weapons/:id', { preHandler: server.authenticate }, handleDeleteWeaponById);
};
