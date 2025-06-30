import prisma from '../src/lib/prisma';
import { classes } from './seed-data/classes';
import { weapons, armours, shields } from './seed-data/equipment';
import { skills } from './seed-data/skills';
import { spells } from './seed-data/spells';
import { statusEffects } from './seed-data/status-effects';

const deleteExistingData = async () => {
  await prisma.spell.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.class.deleteMany();
  await prisma.armour.deleteMany();
  await prisma.weapon.deleteMany();
  await prisma.shield.deleteMany();
  await prisma.statusEffect.deleteMany();
};

const seedData = async () => {
  await deleteExistingData();

  await prisma.class.createMany({ data: classes });

  // These depend on classes
  await prisma.skill.createMany({ data: skills });
  await prisma.spell.createMany({ data: spells });

  // Seed equipment data
  await prisma.armour.createMany({ data: armours });
  await prisma.weapon.createMany({ data: weapons });
  await prisma.shield.createMany({ data: shields });

  // Seed other data
  await prisma.statusEffect.createMany({ data: statusEffects });

  console.log('Seed data created!');
};

seedData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
