import prisma from '../lib/prisma';

export const findAllWeapons = async () => {
  return await prisma.weapon.findMany();
};

export const findWeaponById = async ({ id }: { id: string }) => {
  return prisma.weapon.findUnique({
    where: { id },
  });
};
