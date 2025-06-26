import prisma from '../lib/prisma';

export const findUserByEmail = async ({ email }: { email: string }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  return user;
};

export const createUser = async ({
  email,
  hashedPassword,
}: {
  email: string;
  hashedPassword: string;
}) => {
  const createdUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return createdUser;
};
