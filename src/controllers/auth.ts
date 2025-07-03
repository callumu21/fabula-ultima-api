import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser, findUserByEmail } from '../models/users';
import { comparePasswords, hashPassword } from '../utils/auth';

export const handleRegistration = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser)
      return reply.code(400).send({
        msg: 'User already exists.',
      });

    const hashedPassword = await hashPassword(password);
    const user = await createUser({ email, hashedPassword });

    return reply.code(201).send({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ msg: 'Internal server error.' });
  }
};

export const handleLogin = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) return reply.code(400).send({ msg: 'Missing credentials.' });

  try {
    const user = await findUserByEmail(email);

    if (!user) return reply.code(401).send({ msg: 'Invalid credentials.' });

    const valid = await comparePasswords(password, user.password);

    if (!valid) return reply.code(401).send({ msg: 'Invalid credentials.' });

    const token = req.server.jwt.sign({ userId: user.id, role: user.role });
    reply.send({ token });
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ msg: 'Internal server error.' });
  }
};
