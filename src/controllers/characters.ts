import { FastifyReply, FastifyRequest } from 'fastify';
import { findCharacterById } from '../models/characters';
import { findWeaponById } from '../models/weapons';
import { findShieldById } from '../models/shields';
import { formatCharacter } from '../utils';

export const getUsersCharacterById = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const {
    user: { userId },
  } = req;

  try {
    const character = await findCharacterById(id);

    if (!character) {
      return reply.code(404).send({ msg: 'Character not found.' });
    }

    if (character.userId !== userId) {
      return reply.code(403).send({ msg: 'Invalid authorisation.' });
    }

    const [mainHand, offHand] = await Promise.all([
      character.mainHandId && character.mainHandType === 'weapon'
        ? findWeaponById(character.mainHandId)
        : character.mainHandId && character.mainHandType === 'shield'
          ? findShieldById(character.mainHandId)
          : null,

      character.offHandId && character.offHandType === 'weapon'
        ? findWeaponById(character.offHandId)
        : character.offHandId && character.offHandType === 'shield'
          ? findShieldById(character.offHandId)
          : null,
    ]);

    const characterWithEquipment = formatCharacter(character, {
      mainHand,
      offHand,
      armour: character.armour,
      accessory: character.accessory,
    });

    return { character: characterWithEquipment };
  } catch (err) {
    console.error('Unexpected error', err);
    return reply.code(500).send({ msg: 'Internal server error.' });
  }
};
