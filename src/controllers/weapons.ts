import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library';
import { deleteWeaponById, findAllWeapons, findWeaponById } from '../models/weapons';

export const getAllWeapons = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const weapons = await findAllWeapons();

    return { weapons };
  } catch (err) {
    console.error('Unexpected error', err);
    return reply.status(500).send({ msg: 'Internal server error.' });
  }
};

export const getWeaponById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = req.params;

  try {
    const weapon = await findWeaponById({ id });

    if (!weapon) {
      return reply.code(404).send({ msg: 'Weapon not found' });
    }

    return { weapon };
  } catch (err) {
    console.error('Unexpected error', err);
    return reply.status(500).send({ msg: 'Internal server error.' });
  }
};

interface DeleteWeaponRequest extends RouteGenericInterface {
  Params: {
    id: string;
  };
}

export const handleDeleteWeaponById = async (
  req: FastifyRequest<DeleteWeaponRequest>,
  reply: FastifyReply
) => {
  const { id } = req.params;

  try {
    await deleteWeaponById({ id });
    return reply.code(204).send();
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      return reply.code(404).send({ msg: 'Weapon not found.' });
    }

    console.error('Unexpected error', err);
    return reply.status(500).send({ msg: 'Internal server error.' });
  }
};
