import prisma from '../lib/prisma';

export const findAllStatusEffects = async () => {
  const statusEffects = await prisma.statusEffect.findMany();

  return statusEffects;
};

export const findStatusEffectById = async (id: string) => {
  const statusEffect = await prisma.statusEffect.findUnique({ where: { id } });

  return statusEffect;
};
