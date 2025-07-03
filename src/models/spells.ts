import prisma from '../lib/prisma';

export const findAllSpells = async ({ withClass }: { withClass: string | undefined }) => {
  return await prisma.spell.findMany({
    include: { class: withClass === 'true' },
  });
};

export const findSpellById = async ({
  id,
  withClass,
}: {
  id: string;
  withClass: string | undefined;
}) => {
  return await prisma.spell.findUnique({
    where: { id },
    include: { class: withClass === 'true' },
  });
};
