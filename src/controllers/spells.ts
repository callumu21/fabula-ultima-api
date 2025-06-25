import { FastifyReply, FastifyRequest } from 'fastify';
import { findAllSpells, findSpellById } from '../models/spells';

export const getAllSpells = async (
  req: FastifyRequest<{ Querystring: { withClass?: string } }>,
  reply: FastifyReply
) => {
  const { withClass } = req.query;

  try {
    const spells = await findAllSpells({ withClass });

    return { spells };
  } catch (err) {
    console.error('Unexpected error', err);
    return reply.code(500).send({ msg: 'Internal server error.' });
  }
};

export const getSpellById = async (
  req: FastifyRequest<{ Params: { id: string }; Querystring: { withClass?: string } }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const { withClass } = req.query;

  try {
    const spell = await findSpellById({ id, withClass });

    if (!spell) {
      return reply.code(404).send({ msg: 'Spell not found' });
    }

    return { spell };
  } catch (err) {
    console.error('Unexpected error', err);
    return reply.code(500).send({ msg: 'Internal server error.' });
  }
};
