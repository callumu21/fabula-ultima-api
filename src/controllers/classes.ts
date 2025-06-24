import { FastifyReply, FastifyRequest } from 'fastify';
import { findAllClasses, findClassById } from '../models/classes';

export const getAllClasses = async (req: FastifyRequest, reply: FastifyReply) => {
  const classes = await findAllClasses();
  return reply.send({ classes });
};

export const getClassById = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };

  const foundClass = await findClassById(id);

  if (!foundClass) {
    return reply.code(404).send({ msg: 'Class not found' });
  }

  return { class: foundClass };
};
