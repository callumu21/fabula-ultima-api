import prisma from '../lib/prisma';

export const findAllClasses = async () => {
  return await prisma.class.findMany({});
};

export const findClassById = async (id: string) => {
  return await prisma.class.findUnique({ where: { id } });
};
