import prisma from '../lib/prisma';

export const findShieldById = async (id: string) => {
  return await prisma.shield.findUnique({ where: { id } });
};
