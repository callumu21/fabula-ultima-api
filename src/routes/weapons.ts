import { FastifyInstance } from 'fastify';
import {
  getAllWeapons,
  getWeaponById,
  handleCreateWeapon,
  handleDeleteWeaponById,
} from '../controllers/weapons';
import { createWeaponSchema } from '../schemas/weapons';

const weaponRoutes = async (server: FastifyInstance) => {
  server.get('/weapons', getAllWeapons);
  server.post('/weapons', {
    preHandler: server.authorizeAdmin,
    schema: createWeaponSchema,
    handler: handleCreateWeapon,
  });

  server.get('/weapons/:id', getWeaponById);
  server.delete('/weapons/:id', {
    preHandler: server.authorizeAdmin,
    handler: handleDeleteWeaponById,
  });
};

export default weaponRoutes;
