import buildServer from '../server';
import prisma from '../lib/prisma';
import { createMockStatusEffect } from './fixtures/mockData';
import { resetDb } from './utils';

describe('GET /status-effects', () => {
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

  it('returns a single status effect from the database in an array', async () => {
    const slowCondition = createMockStatusEffect();

    await prisma.statusEffect.create({
      data: slowCondition,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/status-effects',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body.statusEffects)).toBe(true);

    const { statusEffects } = body;

    expect(statusEffects).toHaveLength(1);
    expect(statusEffects[0]).toEqual(slowCondition);
  });

  it('returns all status effects from the database in an array', async () => {
    const mockStatusEffects = [
      createMockStatusEffect(),
      createMockStatusEffect({ id: 'mock-skill-2', name: 'Poisoned' }),
    ];

    await prisma.statusEffect.createMany({
      data: mockStatusEffects,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/status-effects',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.statusEffects)).toBe(true);

    const { statusEffects } = body;

    expect(statusEffects).toHaveLength(2);
    expect(statusEffects[0]).toEqual(mockStatusEffects[0]);
    expect(statusEffects[1]).toEqual(mockStatusEffects[1]);
  });

  it('returns an empty array if no skills are in the database', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/status-effects',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.statusEffects)).toBe(true);
    expect(body.statusEffects).toHaveLength(0);
  });
});

describe('GET /status-effects/:id', () => {
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

  it('returns a single matching status effect from the database', async () => {
    const mockStatusEffect = createMockStatusEffect({ id: 'test-condition' });

    await prisma.statusEffect.create({
      data: mockStatusEffect,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/status-effects/test-condition',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);

    const { statusEffect } = body;

    expect(statusEffect).toEqual(mockStatusEffect);
  });

  it('returns a 404 and message if no matching status effect exists', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/skills/not-a-status-effect',
    });

    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Skill not found');
  });
});
