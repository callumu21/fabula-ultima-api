import { FastifyReply, FastifyRequest } from 'fastify';
import { findAllSkills, findSkillById } from '../models/skills';

export const getAllSkills = async (
  req: FastifyRequest<{ Querystring: { withClass?: string } }>,
  reply: FastifyReply
) => {
  const { withClass } = req.query;

  try {
    const skills = await findAllSkills({ withClass });

    return { skills };
  } catch (err) {
    console.error('Unexpected error', err);
    return reply.code(500).send({ msg: 'Internal server error.' });
  }
};

export const getSkillById = async (
  req: FastifyRequest<{ Params: { id: string }; Querystring: { withClass?: string } }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const { withClass } = req.query;

  try {
    const skill = await findSkillById({ id, withClass });

    if (!skill) {
      return reply.code(404).send({ msg: 'Skill not found' });
    }

    return { skill };
  } catch (err) {
    console.error('Unexpected error', err);
    return reply.code(500).send({ msg: 'Internal server error.' });
  }
};
