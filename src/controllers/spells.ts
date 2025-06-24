import { FastifyReply, FastifyRequest } from 'fastify';
import { findAllSpells, findSpellById } from '../models/spells';

export const getAllSpells = async (
  req: FastifyRequest<{ Querystring: { withClass?: string } }>
) => {
  const { withClass } = req.query;

  const spells = await findAllSpells({ withClass });

  return { spells };
};

export const getSpellById = async (
  req: FastifyRequest<{ Params: { id: string }; Querystring: { withClass?: string } }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const { withClass } = req.query;

  const spell = await findSpellById({ id, withClass });

  if (!spell) {
    return reply.code(404).send({ msg: 'Spell not found' });
  }

  return { spell };
};
