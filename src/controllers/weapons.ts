import { FastifyReply, FastifyRequest } from 'fastify';
import { findAllWeapons, findWeaponById } from '../models/weapons';

export const getAllWeapons = async () => {
  const weapons = await findAllWeapons();

  return { weapons };
};

export const getWeaponById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = req.params;

  const weapon = await findWeaponById({ id });

  if (!weapon) {
    return reply.code(404).send({ msg: 'Weapon not found' });
  }

  return { weapon };
};
