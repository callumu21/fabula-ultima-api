import { FastifyReply, FastifyRequest } from 'fastify';
import { findAllClasses, findClassById } from '../models/classes';

export const getAllClasses = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const classes = await findAllClasses();
    return reply.send({ classes });
  } catch (err) {
    console.error('Unexpected error', err);
    return reply.code(500).send({ msg: 'Internal server error.' });
  }
};

export const getClassById = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };

  try {
    const foundClass = await findClassById(id);

    if (!foundClass) {
      return reply.code(404).send({ msg: 'Class not found' });
    }

    return { class: foundClass };
  } catch (err) {
    console.error('Unexpected error', err);
    return reply.code(500).send({ msg: 'Internal server error.' });
  }
};
