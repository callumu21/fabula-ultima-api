import prisma from '../src/lib/prisma';
import { classes } from './seed-data/classes';
import { skills } from './seed-data/skills';
import { spells } from './seed-data/spells';

async function main() {
  await prisma.skill.deleteMany();
  await prisma.class.deleteMany();

  await prisma.class.createMany({ data: classes });
  await prisma.skill.createMany({ data: skills });
  await prisma.spell.createMany({ data: spells });

  console.log('Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
