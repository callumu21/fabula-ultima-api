import buildServer from '../src/server';
import prisma from '../src/lib/prisma';
import { mockClass, mockSkills } from './fixtures/mockData';

describe('GET /skills', () => {
  const server = buildServer();

  beforeAll(async () => {
    await server.ready();
  });

  beforeEach(async () => {
    const tableNames = await prisma.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const truncationPromises = tableNames.map(({ tablename }) => {
      if (tablename !== '_prisma_migrations') {
        return prisma
          .$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`)
          .catch((err) => {
            console.error(err);
          });
      }
      return null;
    });

    await Promise.all(truncationPromises);
  });

  afterAll(async () => {
    await server.close();
    return prisma.$disconnect();
  });

  it('returns a single skill from the database in an array', async () => {
    await prisma.class.create({
      data: mockClass,
    });

    await prisma.skill.create({ data: mockSkills[0] });

    const res = await server.inject({
      method: 'GET',
      url: '/skills',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body.skills)).toBe(true);

    const { skills } = body;

    expect(skills).toHaveLength(1);
    expect(skills[0]).toEqual({ ...mockSkills[0], class: mockClass });
  });

  it('returns all skills from the database in an array', async () => {
    await prisma.class.create({
      data: mockClass,
    });

    await prisma.skill.createMany({
      data: mockSkills,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/skills',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.skills)).toBe(true);

    const { skills } = body;

    expect(skills).toHaveLength(2);
    expect(skills[0]).toEqual({ ...mockSkills[0], class: mockClass });
    expect(skills[1]).toEqual({ ...mockSkills[1], class: mockClass });
  });

  it('returns an empty array if no skills are in the database', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/skills',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.skills)).toBe(true);
    expect(body.skills).toHaveLength(0);
  });
});
