import buildServer from '../src/server';
import prisma from '../src/lib/prisma';
import { createMockClass, createMockSkill } from './fixtures/mockData';

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
    const mockClass = createMockClass();

    await prisma.class.create({
      data: mockClass,
    });

    const mockSkill = createMockSkill();

    await prisma.skill.create({ data: mockSkill });

    const res = await server.inject({
      method: 'GET',
      url: '/skills',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body.skills)).toBe(true);

    const { skills } = body;

    expect(skills).toHaveLength(1);
    expect(skills[0]).toEqual(mockSkill);
  });

  it('returns a single skill with class information when passed withClass query', async () => {
    const mockClass = createMockClass();

    await prisma.class.create({
      data: mockClass,
    });

    const mockSkill = createMockSkill();

    await prisma.skill.create({ data: mockSkill });

    const res = await server.inject({
      method: 'GET',
      url: '/skills?withClass=true',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body.skills)).toBe(true);

    const { skills } = body;

    expect(skills).toHaveLength(1);
    expect(skills[0]).toEqual({ ...mockSkill, class: mockClass });
  });

  it('returns all skills from the database in an array', async () => {
    const mockClass = createMockClass();

    await prisma.class.create({
      data: mockClass,
    });

    const mockSkills = [
      createMockSkill(),
      createMockSkill({ id: 'mock-skill-2', name: 'Mock Skill 2' }),
    ];

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
    expect(skills[0]).toEqual(mockSkills[0]);
    expect(skills[1]).toEqual(mockSkills[1]);
  });

  it('returns all skills from the database with class information when passed withClass query', async () => {
    const mockClass1 = createMockClass();
    const mockClass2 = createMockClass({ id: 'mock-class-2', name: 'Mock Class 2' });

    await prisma.class.createMany({
      data: [mockClass1, mockClass2],
    });

    const mockSkills = [
      createMockSkill(),
      createMockSkill({ id: 'mock-skill-2', name: 'Mock Skill 2', classId: 'mock-class-2' }),
    ];

    await prisma.skill.createMany({
      data: mockSkills,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/skills?withClass=true',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.skills)).toBe(true);

    const { skills } = body;

    expect(skills).toHaveLength(2);
    expect(skills[0]).toEqual({ ...mockSkills[0], class: mockClass1 });
    expect(skills[1]).toEqual({ ...mockSkills[1], class: mockClass2 });
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

describe('GET /skills/:id', () => {
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

  it('returns a single matching skill from the database', async () => {
    const mockClass = createMockClass();

    await prisma.class.create({
      data: mockClass,
    });

    const provokeSkill = createMockSkill({ id: 'provoke' });

    await prisma.skill.create({ data: provokeSkill });

    const res = await server.inject({
      method: 'GET',
      url: '/skills/provoke',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);

    const { skill } = body;

    expect(skill).toEqual(provokeSkill);
  });

  it('returns a single matching skill and class information when passed withClass query', async () => {
    const mockClass = createMockClass();

    await prisma.class.create({
      data: mockClass,
    });

    const provokeSkill = createMockSkill({ id: 'provoke' });

    await prisma.skill.create({ data: provokeSkill });

    const res = await server.inject({
      method: 'GET',
      url: '/skills/provoke?withClass=true',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);

    const { skill } = body;

    expect(skill).toEqual({ ...provokeSkill, class: mockClass });
  });

  it('returns a 404 and message if no matching skill exists', async () => {
    const mockClass = createMockClass();

    await prisma.class.create({
      data: mockClass,
    });

    const provokeSkill = createMockSkill({ id: 'provoke' });

    await prisma.skill.create({ data: provokeSkill });

    const res = await server.inject({
      method: 'GET',
      url: '/skills/not-a-skill',
    });

    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.body);

    expect(body.msg).toEqual('Skill not found');
  });
});
