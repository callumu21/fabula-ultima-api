import buildServer from '../server';
import prisma from '../lib/prisma';
import { createMockWeapon } from './fixtures/mockData';
import { getTestToken } from './utils';

describe('GET /weapons', () => {
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

  it('returns a single weapon from the database in an array', async () => {
    const mockWeapon = createMockWeapon();

    await prisma.weapon.create({
      data: mockWeapon,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/weapons',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body.weapons)).toBe(true);

    const { weapons } = body;

    expect(weapons).toHaveLength(1);
    expect(weapons[0]).toEqual(mockWeapon);
  });

  it('returns all weapons from the database in an array', async () => {
    const mockWeapons = [
      createMockWeapon(),
      createMockWeapon({ id: 'mock-weapon-2', name: 'Mock Weapon 2' }),
    ];

    await prisma.weapon.createMany({
      data: mockWeapons,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/weapons',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.weapons)).toBe(true);

    const { weapons } = body;

    expect(weapons).toHaveLength(2);
    expect(weapons[0]).toEqual(mockWeapons[0]);
    expect(weapons[1]).toEqual(mockWeapons[1]);
  });

  it('returns an empty array if no skills are in the database', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/weapons',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.weapons)).toBe(true);
    expect(body.weapons).toHaveLength(0);
  });
});

describe('GET /weapons/:id', () => {
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

  it('returns a single matching weapon from the database', async () => {
    const greatsword = createMockWeapon({ id: 'greatsword' });

    await prisma.weapon.create({ data: greatsword });

    const res = await server.inject({
      method: 'GET',
      url: '/weapons/greatsword',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);

    const { weapon } = body;

    expect(weapon).toEqual(greatsword);
  });

  it('returns a 404 and message if no matching weapon exists', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/weapons/not-a-weapon',
    });

    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.body);

    expect(body.msg).toEqual('Weapon not found');
  });
});

describe('DELETE /weapons/:id', () => {
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

  it('deletes a single weapon from the database and returns a 204 with valid JWT', async () => {
    const token = getTestToken(server);

    const greatsword = createMockWeapon({ id: 'greatsword' });

    await prisma.weapon.create({ data: greatsword });

    const deleteRes = await server.inject({
      method: 'DELETE',
      url: '/weapons/greatsword',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(deleteRes.statusCode).toBe(204);

    const fetchRes = await server.inject({
      method: 'GET',
      url: '/weapons/greatsword',
    });

    expect(fetchRes.statusCode).toBe(404);
  });

  it('returns a 404 and error message if id is not associated with a weapon and JWT is valid', async () => {
    const token = getTestToken(server);

    const res = await server.inject({
      method: 'DELETE',
      url: '/weapons/not-a-weapon',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.statusCode).toBe(404);

    const body = JSON.parse(res.body);
    expect(body.msg).toEqual('Weapon not found.');
  });

  it('returns a 401 and error message if JWT is invalid', async () => {
    const invalidToken = 'kajsdlkjaslkdjas';

    const res = await server.inject({
      method: 'DELETE',
      url: '/weapons/not-a-weapon',
      headers: {
        Authorization: `Bearer ${invalidToken}`,
      },
    });

    expect(res.statusCode).toBe(401);

    const body = JSON.parse(res.body);

    expect(body.code).toEqual('FST_JWT_AUTHORIZATION_TOKEN_INVALID');
  });
});
