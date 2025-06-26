import buildServer from '../server';
import prisma from '../lib/prisma';
import { createMockClass } from './fixtures/mockData';
import { resetDb } from './utils';

describe('GET /classes', () => {
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

  it('returns a single class from the database in an array', async () => {
    const mockClass = createMockClass();

    await prisma.class.create({
      data: mockClass,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/classes',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body.classes)).toBe(true);

    const { classes } = body;

    expect(classes).toHaveLength(1);
    expect(classes[0]).toEqual(mockClass);
  });

  it('returns all skills from the database in an array', async () => {
    const mockClasses = [
      createMockClass(),
      createMockClass({ id: 'test-id-2', name: 'Test Class 2' }),
    ];

    await prisma.class.createMany({
      data: mockClasses,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/classes',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.classes)).toBe(true);

    const { classes } = body;

    expect(classes).toHaveLength(2);
    expect(classes[0]).toEqual(mockClasses[0]);
    expect(classes[1]).toEqual(mockClasses[1]);
  });

  it('returns an empty array if no skills are in the database', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/classes',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.classes)).toBe(true);
    expect(body.classes).toHaveLength(0);
  });
});

describe('GET /classes/:id', () => {
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

  it('returns a single matching class from the database', async () => {
    const mockClass = createMockClass({ id: 'test-class' });

    await prisma.class.create({
      data: mockClass,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/classes/test-class',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);

    expect(body.class).toEqual(mockClass);
  });

  it('returns a 404 and message if no matching class exists', async () => {
    const mockClass = createMockClass({ id: 'test-class' });

    await prisma.class.create({
      data: mockClass,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/classes/not-a-class',
    });

    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.body);

    expect(body.msg).toEqual('Class not found');
  });
});
