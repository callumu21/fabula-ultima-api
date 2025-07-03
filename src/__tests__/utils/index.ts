import { ItemType, PrismaClient } from '../../../generated/prisma';
import { FastifyInstance } from 'fastify';
import { Character } from '../../typings';

export const resetDb = async (prismaInstance: PrismaClient): Promise<void> => {
  const tableNames = await prismaInstance.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const truncationPromises = tableNames.map(({ tablename }) => {
    if (tablename !== '_prisma_migrations') {
      return prismaInstance
        .$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`)
        .catch((err) => {
          console.error(err);
        });
    }
    return null;
  });

  await Promise.all(truncationPromises);
};

type PlayerDetails = {
  userId: number;
  role: 'ADMIN' | 'PLAYER';
};

export const getTestToken = (
  app: FastifyInstance,
  overrides: Partial<PlayerDetails> = {}
): string => {
  const payload: PlayerDetails = {
    userId: 1,
    role: 'PLAYER',
    ...overrides,
  };

  return app.jwt.sign(payload);
};

export const createSeedableCharacter = ({
  character,
  userId,
}: {
  character: Character;
  userId: number;
}) => {
  return {
    id: character.id,
    name: character.name,
    identity: character.identity,
    theme: character.theme,
    origin: character.origin,
    pronouns: character.pronouns,
    profilePicture: character.profilePicture,

    dexBase: character.attributes.dexterity.base,
    dexCurrent: character.attributes.dexterity.current,
    insBase: character.attributes.insight.base,
    insCurrent: character.attributes.insight.current,
    migBase: character.attributes.might.base,
    migCurrent: character.attributes.might.current,
    wlpBase: character.attributes.willpower.base,
    wlpCurrent: character.attributes.willpower.current,

    hpMax: character.hitPoints.max,
    hpCurrent: character.hitPoints.current,
    mpMax: character.mindPoints.max,
    mpCurrent: character.mindPoints.current,
    ipMax: character.inventoryPoints.max,
    ipCurrent: character.inventoryPoints.current,
    userId,

    mainHandId: character.equipment.slots.mainHand?.id || null,
    mainHandType: (!character.equipment.slots.mainHand
      ? null
      : 'handsRequired' in character.equipment.slots.mainHand
        ? 'weapon'
        : 'shield') as ItemType,
    offHandId: character.equipment.slots.offHand?.id || null,
    offHandType: (!character.equipment.slots.offHand
      ? null
      : 'handsRequired' in character.equipment.slots.offHand
        ? 'weapon'
        : 'shield') as ItemType,
    armourId: character.equipment.slots.armour?.id || null,
    accessoryId: character.equipment.slots.accessory?.id || null,
    zenit: character.zenit,
  };
};
