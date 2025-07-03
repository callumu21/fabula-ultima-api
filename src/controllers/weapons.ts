import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library';
import { createWeapon, deleteWeaponById, findAllWeapons, findWeaponById } from '../models/weapons';
import { Weapon } from '../typings';
import { createIdFromName } from '../utils';

export const getAllWeapons = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const weapons = await findAllWeapons();

    return { weapons };
  } catch (err) {
    console.error('Unexpected error', err);
    return reply.status(500).send({ msg: 'Internal server error.' });
  }
};

export const handleCreateWeapon = async (
  req: FastifyRequest<{ Body: Omit<Weapon, 'id'> }>,
  reply: FastifyReply
) => {
  const {
    name,
    category,
    isMartial,
    handsRequired,
    range,
    accuracy,
    damage,
    damageType,
    cost,
    isBasic,
    quality,
  } = req.body;

  const id = createIdFromName(name);

  try {
    const newWeapon = await createWeapon({
      id,
      name,
      category,
      isMartial,
      handsRequired,
      range,
      accuracy,
      damage,
      damageType,
      cost,
      isBasic,
      quality,
    });

    return reply.code(201).send({ weapon: newWeapon });
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ msg: 'Internal server error.' });
  }
};

export const getWeaponById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = req.params;

  try {
    const weapon = await findWeaponById(id);

    if (!weapon) {
      return reply.code(404).send({ msg: 'Weapon not found' });
    }

    return { weapon };
  } catch (err) {
    console.error('Unexpected error', err);
    return reply.status(500).send({ msg: 'Internal server error.' });
  }
};

export const handleDeleteWeaponById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = req.params;

  try {
    await deleteWeaponById(id);
    return reply.code(204).send();
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      return reply.code(404).send({ msg: 'Weapon not found.' });
    }

    console.error('Unexpected error', err);
    return reply.status(500).send({ msg: 'Internal server error.' });
  }
};
