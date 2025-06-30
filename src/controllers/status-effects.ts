import { FastifyReply, FastifyRequest } from 'fastify';
import { findAllStatusEffects, findStatusEffectById } from '../models/status-effects';

export const getAllStatusEffects = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const statusEffects = await findAllStatusEffects();
    return reply.send({ statusEffects });
  } catch (err) {
    console.error('Unexpected error', err);
    return reply.code(500).send({ msg: 'Internal server error.' });
  }
};

export const getStatusEffectById = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };

  try {
    const statusEffect = await findStatusEffectById(id);

    if (!statusEffect) {
      return reply.code(404).send({ msg: 'Status effect not found.' });
    }

    return { statusEffect };
  } catch (err) {
    console.error('Unexpected error', err);
    return reply.code(500).send({ msg: 'Internal server error.' });
  }
};
