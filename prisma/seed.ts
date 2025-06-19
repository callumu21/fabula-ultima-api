import prisma from '../src/lib/prisma';

async function main() {
  await prisma.skill.deleteMany();
  await prisma.class.deleteMany();

  const sharpshooter = await prisma.class.create({
    data: {
      id: 'sharpshooter',
      name: 'Sharpshooter',
    },
  });

  await prisma.skill.createMany({
    data: [
      {
        id: 'barrage',
        name: 'Barrage',
        description:
          "When you perform a ranged attack, you may spend 10 Mind Points to choose one option: the attack gains multi (2); or you increase the attack's multi property by one, up to a maximum of multi (3).",
        classId: sharpshooter.id,
      },
      {
        id: 'crossfire',
        name: 'Crossfire',
        description:
          'After a creature you can see performs a ranged attack, you may spend an amount of Mind Points equal to the total Result of their Accuracy Check in order to have the attack fail automatically against all targets.',
        classId: sharpshooter.id,
      },
    ],
  });

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
