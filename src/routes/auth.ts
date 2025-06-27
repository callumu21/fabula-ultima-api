import { FastifyInstance } from 'fastify';
import { handleRegistration, handleLogin } from '../controllers/auth';
import { registerSchema } from '../schemas/auth';

const authRoutes = async (server: FastifyInstance) => {
  server.post('/auth/register', {
    preHandler: server.authorizeAdmin,
    schema: registerSchema,
    handler: handleRegistration,
  });
  server.post('/auth/login', handleLogin);
};

export default authRoutes;
