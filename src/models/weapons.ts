import prisma from '../lib/prisma';
import { Weapon } from '../typings';

export const findAllWeapons = async () => {
  return await prisma.weapon.findMany();
};

export const findWeaponById = async (id: string) => {
  const weapon = await prisma.weapon.findUnique({
    where: { id },
  });

  if (!weapon) return null;

  return {
    ...weapon,
    handsRequired: weapon.handsRequired as 1 | 2,
  };
};

export const createWeapon = async (newWeapon: Weapon) => {
  return await prisma.weapon.create({ data: newWeapon });
};

export const deleteWeaponById = async (id: string) => {
  return await prisma.weapon.delete({
    where: { id },
  });
};
