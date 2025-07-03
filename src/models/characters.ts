import { Prisma } from '../../generated/prisma';
import prisma from '../lib/prisma';

const characterWithIncludes = Prisma.validator<Prisma.CharacterInclude>()({
  accessory: true,
  armour: true,
  bonds: true,
  classLevels: {
    include: {
      class: true,
    },
  },
  spells: { include: { spell: true } },
  skills: { include: { skill: true } },
  statusEffects: { include: { statusEffect: true } },
});

export type CharacterWithRelations = Prisma.CharacterGetPayload<{
  include: typeof characterWithIncludes;
}>;

export const findCharacterById = async (id: string): Promise<CharacterWithRelations | null> => {
  const character = await prisma.character.findUnique({
    where: { id },
    include: characterWithIncludes,
  });

  return character;
};
