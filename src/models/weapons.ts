import prisma from '../lib/prisma';
import { Weapon } from '../typings';

export const findAllWeapons = async () => {
  return await prisma.weapon.findMany();
};

export const findWeaponById = async ({ id }: { id: string }) => {
  return prisma.weapon.findUnique({
    where: { id },
  });
};

export const createWeapon = async (newWeapon: Weapon) => {
  return prisma.weapon.create({ data: newWeapon });
};

export const deleteWeaponById = async ({ id }: { id: string }) => {
  return prisma.weapon.delete({
    where: { id },
  });
};
