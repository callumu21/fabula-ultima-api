import buildServer from '../src/server';
import prisma from '../src/lib/prisma';
import { createMockClass, createMockSpell } from './fixtures/mockData';

describe('GET /spells', () => {
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

  it('returns a single spell from the database in an array', async () => {
    const mockClass = createMockClass();

    await prisma.class.create({
      data: mockClass,
    });

    const mockSpell = createMockSpell();

    await prisma.spell.create({ data: mockSpell });

    const res = await server.inject({
      method: 'GET',
      url: '/spells',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body.spells)).toBe(true);

    const { spells } = body;

    expect(spells).toHaveLength(1);
    expect(spells[0]).toEqual(mockSpell);
  });

  it('returns a single spell from the database in an array with class information when passed withClass query', async () => {
    const mockClass = createMockClass();

    await prisma.class.create({
      data: mockClass,
    });

    const mockSpell = createMockSpell();

    await prisma.spell.create({ data: mockSpell });

    const res = await server.inject({
      method: 'GET',
      url: '/spells?withClass=true',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body.spells)).toBe(true);

    const { spells } = body;

    expect(spells).toHaveLength(1);
    expect(spells[0]).toEqual({ ...mockSpell, class: mockClass });
  });

  it('returns all spells from the database in an array', async () => {
    const mockClass = createMockClass();

    await prisma.class.create({
      data: mockClass,
    });

    const mockSpells = [
      createMockSpell(),
      createMockSpell({ id: 'mock-spell-2', name: 'Mock Spell 2' }),
    ];

    await prisma.spell.createMany({
      data: mockSpells,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/spells',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.spells)).toBe(true);

    const { spells } = body;

    expect(spells).toHaveLength(2);
    expect(spells[0]).toEqual(mockSpells[0]);
    expect(spells[1]).toEqual(mockSpells[1]);
  });

  it('returns all spells from the database in an array with class information when passed withClass query', async () => {
    const mockClass = createMockClass();

    await prisma.class.create({
      data: mockClass,
    });

    const mockSpells = [
      createMockSpell(),
      createMockSpell({ id: 'mock-spell-2', name: 'Mock Spell 2' }),
    ];

    await prisma.spell.createMany({
      data: mockSpells,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/spells?withClass=true',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.spells)).toBe(true);

    const { spells } = body;

    expect(spells).toHaveLength(2);
    expect(spells[0]).toEqual({ ...mockSpells[0], class: mockClass });
    expect(spells[1]).toEqual({ ...mockSpells[1], class: mockClass });
  });

  it('returns an empty array if no skills are in the database', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/spells',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.spells)).toBe(true);
    expect(body.spells).toHaveLength(0);
  });
});

describe('GET /spells/:id', () => {
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

  it('returns a single matching spell and class information from the database', async () => {
    const mockClass = createMockClass();

    await prisma.class.create({
      data: mockClass,
    });

    const elementalShroudSpell = createMockSpell({ id: 'elemental-shroud' });

    await prisma.spell.create({ data: elementalShroudSpell });

    const res = await server.inject({
      method: 'GET',
      url: '/spells/elemental-shroud',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);

    const { spell } = body;

    expect(spell).toEqual({ ...elementalShroudSpell, class: mockClass });
  });

  it('returns a 404 and message if no matching spell exists', async () => {
    const mockClass = createMockClass();

    await prisma.class.create({
      data: mockClass,
    });

    const elementalShroudSpell = createMockSpell({ id: 'elemental-shroud' });

    await prisma.spell.create({ data: elementalShroudSpell });

    const res = await server.inject({
      method: 'GET',
      url: '/spells/not-a-spell',
    });

    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.body);

    expect(body.msg).toEqual('Spell not found');
  });
});
