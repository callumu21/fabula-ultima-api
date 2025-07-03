import prisma from '../lib/prisma';

export const findAllSkills = async ({ withClass }: { withClass: string | undefined }) => {
  return await prisma.skill.findMany({
    include: { class: withClass === 'true' },
  });
};

export const findSkillById = async ({
  id,
  withClass,
}: {
  id: string;
  withClass: string | undefined;
}) => {
  return await prisma.skill.findUnique({
    where: { id },
    include: { class: withClass === 'true' },
  });
};
