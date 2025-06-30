import buildServer from '../server';
import prisma from '../lib/prisma';
import { createMockWeapon } from './fixtures/mockData';
import { getTestToken, resetDb } from './utils';

describe('GET /weapons', () => {
  const server = buildServer();

  beforeAll(async () => {
    await server.ready();
  });

  beforeEach(async () => {
    await resetDb(prisma);
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

describe('POST /weapons', () => {
  const server = buildServer();

  beforeAll(async () => {
    await server.ready();
  });

  beforeEach(async () => {
    await resetDb(prisma);
  });

  afterAll(async () => {
    await server.close();
    return prisma.$disconnect();
  });

  it('creates a new weapon when payload is valid and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(201);

    const body = JSON.parse(res.body);

    expect(body).toHaveProperty('weapon');
    expect(body.weapon).toEqual({ ...mockWeapon, id: 'mock-weapon' });
  });

  it('creates a new weapon when payload is valid with extra properties and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        quality: mockWeapon.quality,
        extra: 'SOMETHING WILD',
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(201);

    const body = JSON.parse(res.body);

    expect(body).toHaveProperty('weapon');
    expect(body.weapon).toEqual({ ...mockWeapon, id: 'mock-weapon' });
  });

  it('returns 400 if name is missing but payload is otherwise valid and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('name is a required field.');
  });

  it('returns 400 if name is not a string and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: 123,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Name must be a string.');
  });

  it('returns 400 if name has invalid characters and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: 'Crazy &*&!',
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Invalid name. Name can only have letters, digits and spaces.');
  });

  it('returns 400 if name is too short and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: 'A',
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Name must be at least 3 characters.');
  });

  it('returns 400 if name is too long and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: 'AbcdefghijklmnopqrstuvwxyAbcdefghijklmnopqrstuvwxyz',
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Name must not exceed 40 characters.');
  });

  it('returns 400 if cost is missing but payload is otherwise valid and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        isBasic: mockWeapon.isBasic,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('cost is a required field.');
  });

  it('returns 400 if cost is not a number and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: '100',
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        isBasic: mockWeapon.isBasic,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Cost must be a number.');
  });

  it('returns 400 if cost is negative and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: -50,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        isBasic: mockWeapon.isBasic,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Cost cannot be less than 0.');
  });

  it('returns 400 if isBasic is missing but payload is otherwise valid and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('isBasic is a required field.');
  });

  it('returns 400 if isBasic is not a boolean value and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: 'true',
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('isBasic must be a boolean.');
  });

  it('returns 400 if category is missing but payload is otherwise valid and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('category is a required field.');
  });

  it('returns 400 if category is not a string and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: 1,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Category must be a string.');
  });

  it('returns 400 if category is not a valid weapon category and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: 'shurikens',
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Category must be a valid weapon category.');
  });

  it('returns 400 if isMartial is missing but payload is otherwise valid and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('isMartial is a required field.');
  });

  it('returns 400 if isMartial is not a boolean and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: 'true',
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('isMartial must be a boolean.');
  });

  it('returns 400 if handsRequired is missing but payload is otherwise valid and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('handsRequired is a required field.');
  });

  it('returns 400 if handsRequired is not a number and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: true,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('handsRequired must be a number.');
  });

  it('returns 400 if handsRequired is less than 1 and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: 0,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('handsRequired cannot be lower than 1.');
  });

  it('returns 400 if handsRequired is more than 2 and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: 4,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('handsRequired cannot be more than 2.');
  });

  it('returns 400 if range is missing but payload is otherwise valid and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('range is a required field.');
  });

  it('returns 400 if range is not a number and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: 100,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Range must be a string.');
  });

  it('returns 400 if range is not melee or ranged and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: 'distant',
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Range must be either melee or ranged.');
  });

  it('returns 400 if accuracy is missing but payload is otherwise valid and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('accuracy is a required field.');
  });

  it('returns 400 if accuracy is not a string and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: true,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Accuracy must be a string.');
  });

  it('returns 400 if accuracy does not conform to correct pattern and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: '[MIG] + 1',
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Accuracy must be of the format [ATT + ATT] or [ATT + ATT] + 1');
  });

  it('returns 400 if damage is missing but payload is otherwise valid and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('damage is a required field.');
  });

  it('returns 400 if damage is not a string and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: 100,
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Damage must be a string.');
  });

  it('returns 400 if damage does not conform to correct pattern and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: '[HR]',
        damageType: mockWeapon.damageType,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Damage must be of the format [HR + X] or [HR - X].');
  });

  it('returns 400 if damageType is missing but payload is otherwise valid and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('damageType is a required field.');
  });

  it('returns 400 if damageType is not a string and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: true,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('damageType must be a string.');
  });

  it('returns 400 if damageType is not a valid type of damage and JWT has the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: 'elemental',
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('damageType must be either physical or magical.');
  });

  it('returns 201 if payload is valid but missing quality and JWT has ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(201);

    const body = JSON.parse(res.body);

    expect(body).toHaveProperty('weapon');
    expect(body.weapon).toEqual({ ...mockWeapon, id: 'mock-weapon', quality: null });
  });

  it('returns 400 if quality is not a string or null and JWT has ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        quality: 1,
      },
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Quality must be either a string or null.');
  });

  it('returns 403 if payload is valid but JWT does not have the ADMIN role', async () => {
    const invalidToken = getTestToken(server, { role: 'PLAYER' });

    const mockWeapon = createMockWeapon();

    const res = await server.inject({
      method: 'POST',
      url: '/weapons',
      body: {
        name: mockWeapon.name,
        category: mockWeapon.category,
        isMartial: mockWeapon.isMartial,
        handsRequired: mockWeapon.handsRequired,
        range: mockWeapon.range,
        accuracy: mockWeapon.accuracy,
        damage: mockWeapon.damage,
        damageType: mockWeapon.damageType,
        cost: mockWeapon.cost,
        isBasic: mockWeapon.isBasic,
        quality: mockWeapon.quality,
      },
      headers: {
        Authorization: `Bearer ${invalidToken}`,
      },
    });

    expect(res.statusCode).toBe(403);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Invalid authorisation.');
  });
});

describe('GET /weapons/:id', () => {
  const server = buildServer();

  beforeAll(async () => {
    await server.ready();
  });

  beforeEach(async () => {
    await resetDb(prisma);
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

    expect(body.msg).toBe('Weapon not found');
  });
});

describe('DELETE /weapons/:id', () => {
  const server = buildServer();

  beforeAll(async () => {
    await server.ready();
  });

  beforeEach(async () => {
    await resetDb(prisma);
  });

  afterAll(async () => {
    await server.close();
    return prisma.$disconnect();
  });

  it('deletes a single weapon from the database and returns a 204 with valid JWT and role is ADMIN', async () => {
    const token = getTestToken(server, { role: 'ADMIN' });

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

  it('returns a 404 and error message if id is not associated with a weapon and JWT is valid and role is ADMIN', async () => {
    const token = getTestToken(server, { role: 'ADMIN' });

    const res = await server.inject({
      method: 'DELETE',
      url: '/weapons/not-a-weapon',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.statusCode).toBe(404);

    const body = JSON.parse(res.body);
    expect(body.msg).toBe('Weapon not found.');
  });

  it('returns a 403 and error message if JWT is valid but role is PLAYER', async () => {
    const invalidToken = getTestToken(server, { role: 'PLAYER' });

    const res = await server.inject({
      method: 'DELETE',
      url: '/weapons/not-a-weapon',
      headers: {
        Authorization: `Bearer ${invalidToken}`,
      },
    });

    expect(res.statusCode).toBe(403);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Invalid authorisation.');
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

    expect(body.code).toBe('FST_JWT_AUTHORIZATION_TOKEN_INVALID');
  });
});
